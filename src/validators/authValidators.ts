import { z } from "zod";

export const loginBodyValidator = z
  .object({
    username: z.string().min(3),
    password: z.string().min(6),
  })
  .strict();

export const registerBodyValidator = z
  .object({
    username: z.string().min(3),
    password: z.string().min(6),
    email: z.string().email(),
    avatar: z.string().url(),
  })
  .strict();
