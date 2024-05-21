import { PostType } from "@prisma/client";
import { z } from "zod";

export const postBodyValidator = z
  .object({
    type: z.enum([PostType.TEXT, PostType.LINK, PostType.MEDIA]),
    title: z.string().min(1, "A title is needed").max(100, "Title is too long"),
    content: z.any().optional(),
  })
  .refine((data) => {
    if (data.type != PostType.MEDIA) {
      return typeof data.content === "string" && data.content.length > 0;
    }

    return true;
  });
