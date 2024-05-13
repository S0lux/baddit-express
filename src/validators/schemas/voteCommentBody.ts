import { VoteState } from "@prisma/client";
import z from "zod";

export const voteCommentBodyValidator = z
  .object({
    commentId: z.string().min(1, "Comment ID must be at least 1 character long"),
    state: z.nativeEnum(VoteState),
  })
  .strict("Unexpected field detected in request body.");
