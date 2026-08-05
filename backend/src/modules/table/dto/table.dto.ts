import { z } from 'zod';

export const createTableSchema = z.object({
  branchId: z.string().uuid(),
  tableNumber: z.string().min(1).max(20),
  isActive: z.boolean().optional(),
});
export type CreateTableDto = z.infer<typeof createTableSchema>;

export const updateTableSchema = z.object({
  tableNumber: z.string().min(1).max(20).optional(),
  isActive: z.boolean().optional(),
});
export type UpdateTableDto = z.infer<typeof updateTableSchema>;
