import { z } from 'zod';

export const createMenuItemSchema = z.object({
  branchId: z.string().uuid(),
  categoryId: z.string().uuid(),
  name: z.string().min(2).max(150),
  description: z.string().max(500).optional(),
  image: z.string().url().optional(),
  price: z.number().positive(),
  isVeg: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
});
export type CreateMenuItemDto = z.infer<typeof createMenuItemSchema>;

export const updateMenuItemSchema = createMenuItemSchema.partial().omit({ branchId: true });
export type UpdateMenuItemDto = z.infer<typeof updateMenuItemSchema>;

export const menuQuerySchema = z.object({
  branchId: z.string().uuid(),
  categoryId: z.string().uuid().optional(),
  isVeg: z.coerce.boolean().optional(),
  isAvailable: z.coerce.boolean().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});
export type MenuQueryDto = z.infer<typeof menuQuerySchema>;
