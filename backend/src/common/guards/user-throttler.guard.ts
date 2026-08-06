import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerException, ThrottlerGuard, ThrottlerLimitDetail } from '@nestjs/throttler';
import { AuthUser } from '@common/interfaces/auth-user.interface';

/**
 * ThrottlerGuard variant that tracks requests per authenticated user
 * instead of per IP address. Guests are keyed by their table, staff by
 * their employee id. Unauthenticated requests fall back to the client IP.
 */
@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const user = req.user as AuthUser | undefined;
    const ip = req.ips?.[0] ?? req.ip;
    if (user?.type === 'guest' && user.tableId) {
      // return `guest:${user.tableId}`;
      return `guest:${user.tableId}:${ip}`
    }
    if (user?.type === 'staff' && user.employeeId) {
      return `staff:${user.employeeId}`;
    }
    return ip
  }

  protected async throwThrottlingException(
    context: ExecutionContext,
    throttlerLimitDetail: ThrottlerLimitDetail,
  ): Promise<void> {
    throw new ThrottlerException(
      `You can't place more than two items. Please wait a few minutes before trying again.`,
    );
  }
}
