import { z } from 'zod';

export const createCategorySchema = z.object({
  branchId: z.string().uuid(),
  name: z.string().min(2).max(100),
  isActive: z.boolean().optional(),
});
export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema.partial().omit({ branchId: true });
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
