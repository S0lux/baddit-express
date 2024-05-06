import { z } from "zod";

export const commentBodyValidator = z
  .object({
    content: z.string().min(1, "Content must be not null"),
    postId: z.string().nullable(),
    parentId: z.string().nullable(),
  })
  .strict("Unexpected field detected in request body.");
