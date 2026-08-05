import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().optional(),
  API_PREFIX: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_ACCESS_EXPIRES_IN: z.string().optional(),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_REFRESH_EXPIRES_IN: z.string().optional(),
  GUEST_JWT_SECRET: z.string().min(1, 'GUEST_JWT_SECRET is required'),
  GUEST_TOKEN_EXPIRES_IN: z.string().optional(),
  BCRYPT_SALT_ROUNDS: z.string().optional(),
  APP_DOMAIN: z.string().optional(),
});

export function validateEnv(config: Record<string, unknown>) {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const formatted = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Environment validation failed:\n${formatted}`);
  }

  return result.data;
}
