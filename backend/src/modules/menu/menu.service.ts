import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateMenuItemDto, MenuQueryDto, UpdateMenuItemDto } from './dto/menu.dto';
import { NotFoundException } from '@common/exceptions/app.exception';
import { buildPaginationResult, normalizePagination } from '@common/utils/pagination.util';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMenuItemDto) {
    return this.prisma.menuItem.create({ data: dto });
  }

  async findAll(query: MenuQueryDto) {
    const { page, limit, skip } = normalizePagination(query);

    const where = {
      deletedAt: null,
      branchId: query.branchId,
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.isVeg !== undefined ? { isVeg: query.isVeg } : {}),
      ...(query.isAvailable !== undefined ? { isAvailable: query.isAvailable } : {}),
      ...(query.search
        ? { name: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.menuItem.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.menuItem.count({ where }),
    ]);

    return buildPaginationResult(items, total, page, limit);
  }

  async findOne(id: string) {
    const item = await this.prisma.menuItem.findFirst({
      where: { id, deletedAt: null },
      include: { category: true },
    });
    if (!item) throw new NotFoundException('Menu item', id);
    return item;
  }

  async update(id: string, dto: UpdateMenuItemDto) {
    await this.findOne(id);
    return this.prisma.menuItem.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.menuItem.update({ where: { id }, data: { deletedAt: new Date(), isAvailable: false } });
  }
}
