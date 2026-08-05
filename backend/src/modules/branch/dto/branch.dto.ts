import { z } from 'zod';

export const createBranchSchema = z.object({
  restaurantId: z.string().uuid(),
  name: z.string().min(2).max(150),
  address: z.string().max(255).optional(),
  phone: z.string().min(7).max(20).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
export type CreateBranchDto = z.infer<typeof createBranchSchema>;

export const updateBranchSchema = createBranchSchema.partial().omit({ restaurantId: true });
export type UpdateBranchDto = z.infer<typeof updateBranchSchema>;
