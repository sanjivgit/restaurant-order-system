import { ConflictException as NestConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateTableDto, UpdateTableDto } from './dto/table.dto';
import { NotFoundException } from '@common/exceptions/app.exception';

@Injectable()
export class TableService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateTableDto) {
    const existing = await this.prisma.table.findFirst({
      where: { branchId: dto.branchId, tableNumber: dto.tableNumber, deletedAt: null },
    });
    if (existing) {
      throw new NestConflictException('A table with this number already exists in the branch.');
    }

    const table = await this.prisma.table.create({ data: dto });

    // Every table gets a unique QR code URL pointing to the ordering page, e.g. https://domain.com/order/{tableId}
    const appDomain = this.configService.get<string>('appDomain');
    const qrCodeUrl = `${appDomain}/order/${table.id}`;

    return this.prisma.table.update({ where: { id: table.id }, data: { qrCodeUrl } });
  }

  async findAll(branchId: string) {
    return this.prisma.table.findMany({ where: { branchId, deletedAt: null }, orderBy: { tableNumber: 'asc' } });
  }

  async findOne(id: string) {
    const table = await this.prisma.table.findFirst({ where: { id, deletedAt: null } });
    if (!table) throw new NotFoundException('Table', id);
    return table;
  }

  async update(id: string, dto: UpdateTableDto) {
    await this.findOne(id);
    return this.prisma.table.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.table.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  }
}
