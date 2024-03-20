import { z } from "zod";

export const emailTokenValidator = z
  .object({
    token: z.string().min(1, "A token is required to perform this action."),
  })
  .strict("Unexpected field detected in request body.");
