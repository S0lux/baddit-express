import { VoteState } from "@prisma/client";
import z from "zod";

export const voteBodyValidator = z
  .object({
    postId: z.string().min(1, "Post ID must be at least 1 character long"),
    state: z.nativeEnum(VoteState),
  })
  .strict("Unexpected field detected in request body.");
