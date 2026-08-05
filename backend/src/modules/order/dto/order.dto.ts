import { z } from 'zod';

export const orderItemInputSchema = z.object({
  menuItemId: z.string().uuid(),
  quantity: z.number().int().positive().max(50),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemInputSchema).min(1, 'At least one item is required.'),
});
export type CreateOrderDto = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED']),
});
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;

export const orderQuerySchema = z.object({
  branchId: z.string().uuid().optional(),
  tableId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});
export type OrderQueryDto = z.infer<typeof orderQuerySchema>;
