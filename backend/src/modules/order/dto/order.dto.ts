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
  status: z.enum(['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED']),
});
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;

export const ORDER_TIME_SLOT = {
  ALL: 'ALL',
  MORNING: 'MORNING',
  EVENING: 'EVENING',
} as const;
export type OrderTimeSlot = (typeof ORDER_TIME_SLOT)[keyof typeof ORDER_TIME_SLOT];

export const orderQuerySchema = z.object({
  branchId: z.string().uuid().optional(),
  tableId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'ACCEPTED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED']).optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date. Use YYYY-MM-DD format.')
    .optional(),
  timeSlot: z.nativeEnum(ORDER_TIME_SLOT).default(ORDER_TIME_SLOT.ALL),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});
export type OrderQueryDto = z.infer<typeof orderQuerySchema>;
