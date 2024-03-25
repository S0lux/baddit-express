import { z } from "zod";

export const communityBodyValidator = z
  .object({
    name: z.string().min(1, "Community's name must be at least 1 character long"),
    description: z.string().nullable(),
  })
  .strict("Unexpected field detected in request body.");
