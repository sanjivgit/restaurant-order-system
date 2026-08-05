import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateRestaurantDto, UpdateRestaurantDto } from './dto/restaurant.dto';
import { NotFoundException } from '@common/exceptions/app.exception';

@Injectable()
export class RestaurantService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateRestaurantDto) {
    return this.prisma.restaurant.create({ data: dto });
  }

  async findAll() {
    return this.prisma.restaurant.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const restaurant = await this.prisma.restaurant.findFirst({ where: { id, deletedAt: null } });
    if (!restaurant) throw new NotFoundException('Restaurant', id);
    return restaurant;
  }

  async update(id: string, dto: UpdateRestaurantDto) {
    await this.findOne(id);
    return this.prisma.restaurant.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.restaurant.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  }
}
