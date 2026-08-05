import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20).optional(),
  password: z.string().min(6).max(72),
  role: z.enum(['ADMIN', 'EMPLOYEE']).default('EMPLOYEE'),
  // Required for EMPLOYEE role; admins may omit for restaurant-wide access.
  branchId: z.string().uuid().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
export type CreateEmployeeDto = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(7).max(20).optional(),
  password: z.string().min(6).max(72).optional(),
  role: z.enum(['ADMIN', 'EMPLOYEE']).optional(),
  branchId: z.string().uuid().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
export type UpdateEmployeeDto = z.infer<typeof updateEmployeeSchema>;
