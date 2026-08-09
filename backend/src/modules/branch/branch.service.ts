import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { NotFoundException } from '@common/exceptions/app.exception';

@Injectable()
export class BranchService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * The restaurantId always comes from the authenticated user's token (derived
   * from their branch), never from the client, so a caller cannot create a
   * branch under another restaurant.
   */
  create(dto: CreateBranchDto, restaurantId: string) {
    return this.prisma.branch.create({ data: { ...dto, restaurantId } });
  }

  /**
   * Branches are scoped to the caller's restaurantId from their token, so an
   * admin/employee only ever sees branches of their own restaurant.
   */
  async findAll(restaurantId: string) {
    return this.prisma.branch.findMany({
      where: { deletedAt: null, restaurantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, restaurantId: string) {
    const branch = await this.prisma.branch.findFirst({ where: { id, restaurantId, deletedAt: null } });
    if (!branch) throw new NotFoundException('Branch', id);
    return branch;
  }

  async update(id: string, dto: UpdateBranchDto, restaurantId: string) {
    await this.findOne(id, restaurantId);
    return this.prisma.branch.update({ where: { id }, data: dto });
  }

  async remove(id: string, restaurantId: string) {
    await this.findOne(id, restaurantId);
    return this.prisma.branch.update({ where: { id }, data: { deletedAt: new Date(), status: 'INACTIVE' } });
  }
}
