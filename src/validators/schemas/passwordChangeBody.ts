import { z } from "zod";

export const passwordChangeValidator = z
  .object({
    oldPassword: z.string().min(6, "Password is too short"),
    newPassword: z.string().min(6, "Password is too short"),
  })
  .strict();
