import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  PORT: z.string().min(1),
  DOMAIN: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),
  COOKIE_SECRET: z.string().min(1),
  CLOUDINARY_NAME: z.string().min(1),
  CLOUDINARY_KEY: z.string().min(1),
  CLOUDINARY_SECRET: z.string().min(1),
  ENV: z.enum(["DEV", "PRODUCTION"]),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1),
  SWAGGER_API: z.string().min(1),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid or missing environment variables:");
  console.error(parsedEnv.error.errors.forEach((e) => e.path.forEach((p) => console.error(p))));
  process.exit(1);
}

export const env = parsedEnv.data;

type Env = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}
