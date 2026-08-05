import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { NotFoundException } from '@common/exceptions/app.exception';

@Injectable()
export class BranchService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateBranchDto) {
    return this.prisma.branch.create({ data: dto });
  }

  async findAll(restaurantId?: string) {
    return this.prisma.branch.findMany({
      where: { deletedAt: null, ...(restaurantId ? { restaurantId } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const branch = await this.prisma.branch.findFirst({ where: { id, deletedAt: null } });
    if (!branch) throw new NotFoundException('Branch', id);
    return branch;
  }

  async update(id: string, dto: UpdateBranchDto) {
    await this.findOne(id);
    return this.prisma.branch.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.branch.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
  }
}
