import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { NotFoundException } from '@common/exceptions/app.exception';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCategoryDto) {
    return this.prisma.menuCategory.create({ data: dto });
  }

  async findAll(branchId: string, activeOnly = false) {
    return this.prisma.menuCategory.findMany({
      where: { branchId, deletedAt: null, ...(activeOnly ? { isActive: true } : {}) },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.menuCategory.findFirst({ where: { id, deletedAt: null } });
    if (!category) throw new NotFoundException('Menu category', id);
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prisma.menuCategory.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.menuCategory.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  }
}
