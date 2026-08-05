import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async adminStats(branchId?: string) {
    const branchFilter = branchId ? { branchId } : {};
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      todaysCompletedOrders,
      activeEmployees,
    ] = await this.prisma.$transaction([
      this.prisma.order.count({ where: { ...branchFilter } }),
      this.prisma.order.count({ where: { ...branchFilter, status: 'PENDING' } }),
      this.prisma.order.count({ where: { ...branchFilter, status: 'PREPARING' } }),
      this.prisma.order.count({ where: { ...branchFilter, status: 'READY' } }),
      this.prisma.order.count({ where: { ...branchFilter, status: 'COMPLETED' } }),
      this.prisma.order.findMany({
        where: { ...branchFilter, status: 'COMPLETED', updatedAt: { gte: startOfToday } },
        select: { grandTotal: true },
      }),
      this.prisma.employee.count({ where: { ...branchFilter, status: 'ACTIVE', deletedAt: null } }),
    ]);

    const todaysSales = todaysCompletedOrders.reduce((sum, o) => sum + Number(o.grandTotal), 0);

    return {
      totalOrders,
      pendingOrders,
      preparingOrders,
      readyOrders,
      completedOrders,
      todaysSales: Math.round(todaysSales * 100) / 100,
      activeEmployees,
    };
  }

  async employeeStats(branchId: string) {
    const currentOrders = await this.prisma.order.findMany({
      where: { branchId, status: { in: ['PENDING', 'PREPARING', 'READY'] } },
      include: { items: { include: { menuItem: true } }, table: true },
      orderBy: { createdAt: 'asc' },
    });

    return {
      currentOrdersCount: currentOrders.length,
      currentOrders,
    };
  }
}
