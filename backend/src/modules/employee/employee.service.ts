import { ConflictException as NestConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from './dto/employee.dto';
import { ConflictException, NotFoundException } from '@common/exceptions/app.exception';
import { hashPassword } from '@common/utils/password.util';
import { normalizePagination, buildPaginationResult, PaginationQuery } from '@common/utils/pagination.util';

const EMPLOYEE_SAFE_SELECT = {
  id: true,
  employeeCode: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  branchId: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(dto: CreateEmployeeDto) {
    const existing = await this.prisma.employee.findFirst({ where: { email: dto.email, deletedAt: null } });
    if (existing) {
      throw new ConflictException('An employee with this email already exists.');
    }

    if (dto.role === 'EMPLOYEE' && !dto.branchId) {
      throw new NestConflictException('branchId is required for employees with the EMPLOYEE role.');
    }

    const saltRounds = this.configService.get<number>('auth.bcryptSaltRounds')!;
    const hashedPassword = await hashPassword(dto.password, saltRounds);
    const employeeCode = await this.generateEmployeeCode();

    return this.prisma.employee.create({
      data: {
        employeeCode,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        role: dto.role,
        branchId: dto.branchId,
        status: dto.status ?? 'ACTIVE',
      },
      select: EMPLOYEE_SAFE_SELECT,
    });
  }

  async findAll(branchId: string | undefined, query: PaginationQuery) {
    const { page, limit, skip } = normalizePagination(query);
    const where = {
      deletedAt: null,
      ...(branchId ? { branchId } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: 'insensitive' as const } },
              { email: { contains: query.search, mode: 'insensitive' as const } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.employee.findMany({
        where,
        select: EMPLOYEE_SAFE_SELECT,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.employee.count({ where }),
    ]);

    return buildPaginationResult(items, total, page, limit);
  }

  async findOne(id: string) {
    const employee = await this.prisma.employee.findFirst({
      where: { id, deletedAt: null },
      select: EMPLOYEE_SAFE_SELECT,
    });
    if (!employee) throw new NotFoundException('Employee', id);
    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto) {
    await this.findOne(id);

    const data: Record<string, unknown> = { ...dto };
    if (dto.password) {
      const saltRounds = this.configService.get<number>('auth.bcryptSaltRounds')!;
      data.password = await hashPassword(dto.password, saltRounds);
    }

    return this.prisma.employee.update({ where: { id }, data, select: EMPLOYEE_SAFE_SELECT });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
      select: EMPLOYEE_SAFE_SELECT,
    });
  }

  private async generateEmployeeCode(): Promise<string> {
    const count = await this.prisma.employee.count();
    const next = (count + 1).toString().padStart(5, '0');
    return `EMP-${next}`;
  }
}
