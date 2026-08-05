import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@/prisma/prisma.service';
import { GuestTokenDto, RefreshTokenDto, StaffLoginDto } from './dto/auth.dto';
import { NotFoundException, InvalidCredentialsException, ForbiddenActionException } from '@common/exceptions/app.exception';
import { comparePassword } from '@common/utils/password.util';
import { JWT_GUEST_TYPE, JWT_STAFF_TYPE } from '@common/constants/app.constants';
import { Role } from '@common/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Issues a short-lived guest token scoped to a single table.
   * No customer account/registration is required.
   */
  async issueGuestToken(dto: GuestTokenDto) {
    const table = await this.prisma.table.findFirst({
      where: { id: dto.tableId, deletedAt: null, isActive: true },
      include: { branch: true },
    });

    if (!table) {
      throw new NotFoundException('Table', dto.tableId);
    }

    const payload = {
      type: JWT_GUEST_TYPE,
      restaurantId: table.branch.restaurantId,
      branchId: table.branchId,
      tableId: table.id,
    };

    const expiresIn = this.configService.get<string>('auth.guestTokenExpiresIn');
    const secret = this.configService.get<string>('auth.guestJwtSecret');

    const token = await this.jwtService.signAsync(payload, { secret, expiresIn });

    return {
      guestToken: token,
      expiresIn,
      branchId: table.branchId,
      tableId: table.id,
    };
  }

  /**
   * Employee/Admin login. Both share the same login endpoint;
   * the resulting token's `role` claim determines what they can access.
   */
  async staffLogin(dto: StaffLoginDto) {
    const employee = await this.prisma.employee.findFirst({
      where: { email: dto.email, deletedAt: null },
    });

    if (!employee) {
      throw new InvalidCredentialsException();
    }

    if (employee.status !== 'ACTIVE') {
      throw new ForbiddenActionException('Your account is inactive. Please contact an administrator.');
    }

    const passwordMatches = await comparePassword(dto.password, employee.password);
    if (!passwordMatches) {
      throw new InvalidCredentialsException();
    }

    return this.buildTokenPair(employee.id, employee.role as Role, employee.branchId);
  }

  async refresh(dto: RefreshTokenDto) {
    const secret = this.configService.get<string>('auth.jwtRefreshSecret');

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(dto.refreshToken, { secret });
    } catch {
      throw new InvalidCredentialsException('Refresh token is invalid or expired.');
    }

    const employee = await this.prisma.employee.findFirst({
      where: { id: payload.sub, deletedAt: null, status: 'ACTIVE' },
    });

    if (!employee) {
      throw new InvalidCredentialsException('Refresh token is invalid or expired.');
    }

    return this.buildTokenPair(employee.id, employee.role as Role, employee.branchId);
  }

  private async buildTokenPair(employeeId: string, role: Role, branchId: string | null) {
    const basePayload = { type: JWT_STAFF_TYPE, sub: employeeId, role, branchId };

    const accessToken = await this.jwtService.signAsync(basePayload, {
      secret: this.configService.get<string>('auth.jwtAccessSecret'),
      expiresIn: this.configService.get<string>('auth.jwtAccessExpiresIn'),
    });

    const refreshToken = await this.jwtService.signAsync(basePayload, {
      secret: this.configService.get<string>('auth.jwtRefreshSecret'),
      expiresIn: this.configService.get<string>('auth.jwtRefreshExpiresIn'),
    });

    return {
      accessToken,
      refreshToken,
      role,
      branchId,
    };
  }
}
