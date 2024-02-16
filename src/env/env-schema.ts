import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.coerce.number().optional().default(3001),
  MONGODB_URL: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;
