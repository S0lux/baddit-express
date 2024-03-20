import { z } from "zod";

export const loginBodyValidator = z
  .object({
    username: z.string().min(3),
    password: z.string().min(6),
  })
  .strict("Unexpected field detected in request body.");
