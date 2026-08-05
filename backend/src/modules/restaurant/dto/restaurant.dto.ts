import { z } from 'zod';

export const createRestaurantSchema = z.object({
  name: z.string().min(2).max(150),
  logo: z.string().url().optional(),
  phone: z.string().min(7).max(20).optional(),
  email: z.string().email().optional(),
  gstNumber: z.string().max(30).optional(),
});
export type CreateRestaurantDto = z.infer<typeof createRestaurantSchema>;

export const updateRestaurantSchema = createRestaurantSchema.partial();
export type UpdateRestaurantDto = z.infer<typeof updateRestaurantSchema>;
