import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PUBLIC_KEY, JWT_GUEST_TYPE, JWT_STAFF_TYPE } from '@common/constants/app.constants';
import { AuthUser } from '@common/interfaces/auth-user.interface';
import { Role } from '@common/enums/role.enum';

/**
 * Single global guard that validates either:
 *  - a guest JWT (signed with GUEST_JWT_SECRET), or
 *  - a staff JWT (signed with JWT_ACCESS_SECRET, employee or admin)
 * and normalizes both into `request.user: AuthUser`.
 *
 * Routes decorated with @Public() skip authentication entirely.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token is missing.');
    }

    const decoded = this.jwtService.decode(token) as { type?: string } | null;

    if (!decoded?.type) {
      throw new UnauthorizedException('Invalid authentication token.');
    }

    try {
      if (decoded.type === JWT_GUEST_TYPE) {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('auth.guestJwtSecret'),
        });
        request.user = this.toGuestUser(payload);
      } else if (decoded.type === JWT_STAFF_TYPE) {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('auth.jwtAccessSecret'),
        });
        request.user = this.toStaffUser(payload);
      } else {
        throw new UnauthorizedException('Unrecognized token type.');
      }
    } catch {
      throw new UnauthorizedException('Session expired or token is invalid. Please authenticate again.');
    }

    return true;
  }

  private extractToken(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private toGuestUser(payload: any): AuthUser {
    return {
      type: 'guest',
      role: Role.GUEST,
      restaurantId: payload.restaurantId,
      branchId: payload.branchId,
      tableId: payload.tableId,
    };
  }

  private toStaffUser(payload: any): AuthUser {
    return {
      type: 'staff',
      role: payload.role === Role.ADMIN ? Role.ADMIN : Role.EMPLOYEE,
      employeeId: payload.sub,
      branchId: payload.branchId ?? null,
    };
  }
}
