import { z } from 'zod';

export const guestTokenSchema = z.object({
  tableId: z.string().uuid('tableId must be a valid UUID.'),
  // Optional existing guest token. If provided and still valid for this table,
  // the same token is returned instead of issuing a new one.
  token: z.string().min(1).optional(),
});
export type GuestTokenDto = z.infer<typeof guestTokenSchema>;

export const staffLoginSchema = z.object({
  email: z.string().email('A valid email is required.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});
export type StaffLoginDto = z.infer<typeof staffLoginSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken is required.'),
});
export type RefreshTokenDto = z.infer<typeof refreshTokenSchema>;
