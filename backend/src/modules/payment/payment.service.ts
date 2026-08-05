import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException, ForbiddenActionException } from '@common/exceptions/app.exception';
import { AuthUser } from '@common/interfaces/auth-user.interface';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async findByOrder(user: AuthUser, orderId: string) {
    const order = await this.prisma.order.findFirst({ where: { id: orderId }, include: { bill: true } });
    if (!order) throw new NotFoundException('Order', orderId);

    this.assertCanAccessBill(user, order);

    if (!order.bill) {
      throw new NotFoundException('Bill for this order (order is not yet completed)');
    }

    return order.bill;
  }

  private assertCanAccessBill(user: AuthUser, order: { branchId: string; tableId: string }) {
    if (user.type === 'guest') {
      if (order.tableId !== user.tableId) {
        throw new ForbiddenActionException('You can only view the bill for your own table session.');
      }
      return;
    }

    if (user.role === 'EMPLOYEE' && order.branchId !== user.branchId) {
      throw new ForbiddenActionException('You can only view bills for your own branch.');
    }
  }
}
