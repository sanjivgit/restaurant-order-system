import { Role } from '@common/enums/role.enum';

/**
 * Normalized shape attached to `request.user` after JWT validation,
 * regardless of whether the caller is a guest, employee, or admin.
 */
export interface AuthUser {
  type: 'guest' | 'staff';
  role: Role;
  // Staff fields
  employeeId?: string;
  branchId?: string | null;
  // Guest fields
  restaurantId?: string;
  tableId?: string;
  guestToken?: string;
}
