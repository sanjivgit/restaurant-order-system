import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateOrderDto, OrderQueryDto, UpdateOrderStatusDto } from './dto/order.dto';
import {
  AppException,
  ForbiddenActionException,
  InvalidOrderStatusTransitionException,
  NotFoundException,
} from '@common/exceptions/app.exception';
import { HttpStatus } from '@nestjs/common';
import { AuthUser } from '@common/interfaces/auth-user.interface';
import { ORDER_STATUS_TRANSITIONS, OrderStatus } from '@common/enums/order-status.enum';
import { ORDER_TAX_RATE } from './order.constants';
import { buildPaginationResult, normalizePagination } from '@common/utils/pagination.util';

const ORDER_INCLUDE = {
  items: { include: { menuItem: true } },
  table: true,
  bill: true,
} as const;

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Guest creates an order. The guest's token already scopes them to a
   * single restaurant/branch/table, so those cannot be spoofed by the client.
   */
  async create(user: AuthUser, dto: CreateOrderDto) {
    const menuItemIds = dto.items.map((i) => i.menuItemId);

    const menuItems = await this.prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, branchId: user.branchId!, deletedAt: null, isAvailable: true },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new AppException('One or more menu items are invalid or unavailable.', HttpStatus.BAD_REQUEST);
    }

    const priceMap = new Map<string, number>(menuItems.map((item) => [item.id, Number(item.price)]));

    let subtotal = 0;
    const orderItemsData = dto.items.map((item) => {
      const price = priceMap.get(item.menuItemId)!;
      const itemSubtotal = price * item.quantity;
      subtotal += itemSubtotal;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price,
        subtotal: itemSubtotal,
      };
    });

    const tax = Math.round(subtotal * ORDER_TAX_RATE * 100) / 100;
    const grandTotal = Math.round((subtotal + tax) * 100) / 100;
    const orderNumber = this.generateOrderNumber();

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        restaurantId: user.restaurantId!,
        branchId: user.branchId!,
        tableId: user.tableId!,
        guestToken: user.guestToken,
        subtotal,
        tax,
        grandTotal,
        items: { create: orderItemsData },
      },
      include: ORDER_INCLUDE,
    });

    return order;
  }

  async findAllForStaff(user: AuthUser, query: OrderQueryDto) {
    const { page, limit, skip } = normalizePagination(query);

    // Employees are restricted to their own branch; admins may query any branch (or all).
    const branchId = user.role === 'EMPLOYEE' ? user.branchId! : query.branchId;

    // Newly placed orders are only visible to admins until accepted. Employees
    // see only the accepted orders still in progress (nothing PENDING or CANCELLED).
    const where = {
      ...(branchId ? { branchId } : {}),
      ...(query.tableId ? { tableId: query.tableId } : {}),
      ...(user.role === 'EMPLOYEE'
        ? {
            AND: [
              { ...(query.status ? { status: query.status } : {}) },
              { status: { notIn: [OrderStatus.PENDING, OrderStatus.CANCELLED] } },
            ],
          }
        : { ...(query.status ? { status: query.status } : {}) }),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({ where, include: ORDER_INCLUDE, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.order.count({ where }),
    ]);

    return buildPaginationResult(items, total, page, limit);
  }

  /**
   * Lists orders placed from the guest's table. The guest token already
   * scopes the caller to a single table, so orders cannot be spoofed.
   */
  async findAllForGuest(user: AuthUser) {
    return this.prisma.order.findMany({
      where: { guestToken: user.guestToken },
      include: ORDER_INCLUDE,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(user: AuthUser, id: string) {
    const order = await this.prisma.order.findFirst({ where: { id }, include: ORDER_INCLUDE });
    if (!order) throw new NotFoundException('Order', id);

    this.assertCanAccessOrder(user, order);
    return order;
  }

  async updateStatus(user: AuthUser, id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findFirst({ where: { id } });
    if (!order) throw new NotFoundException('Order', id);

    // Only staff (employee/admin) update order status, and employees only within their own branch.
    if (user.role === 'EMPLOYEE') {
      if (order.branchId !== user.branchId) {
        throw new ForbiddenActionException('You can only update orders for your own branch.');
      }
      // Employees may only move accepted orders through the kitchen flow:
      // ACCEPTED -> PREPARING -> READY -> SERVED. Admin accepts (PENDING -> ACCEPTED)
      // and completes (SERVED -> COMPLETED) orders.
      const employeeTargets = [OrderStatus.PREPARING, OrderStatus.READY, OrderStatus.SERVED];
      if (!employeeTargets.includes(dto.status as OrderStatus)) {
        throw new ForbiddenActionException('You can only move accepted orders through the kitchen flow.');
      }
    }

    const currentStatus = order.status as OrderStatus;
    const allowedTransitions = ORDER_STATUS_TRANSITIONS[currentStatus];

    if (!allowedTransitions.includes(dto.status as OrderStatus)) {
      throw new InvalidOrderStatusTransitionException(currentStatus, dto.status);
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: ORDER_INCLUDE,
    });

    if (dto.status === OrderStatus.COMPLETED) {
      await this.ensureBill(updated.id, Number(updated.subtotal), Number(updated.tax), Number(updated.grandTotal));
    }

    return updated;
  }

  private async ensureBill(orderId: string, subtotal: number, tax: number, grandTotal: number) {
    const existing = await this.prisma.bill.findUnique({ where: { orderId } });
    if (existing) return existing;

    return this.prisma.bill.create({
      data: { orderId, subtotal, tax, discount: 0, grandTotal },
    });
  }

  private assertCanAccessOrder(user: AuthUser, order: { branchId: string; tableId: string; status: string }) {
    if (user.type === 'guest') {
      if (order.tableId !== user.tableId) {
        throw new ForbiddenActionException('You can only view orders placed from your own table session.');
      }
      return;
    }

    if (user.role === 'EMPLOYEE') {
      if (order.branchId !== user.branchId) {
        throw new ForbiddenActionException('You can only view orders for your own branch.');
      }
      if (order.status === OrderStatus.PENDING) {
        throw new ForbiddenActionException('Order is pending admin acceptance.');
      }
    }
    // Admins may view any order.
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `ORD-${timestamp}-${random}`;
  }
}
