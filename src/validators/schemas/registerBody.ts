import z from "zod";

export const registerBodyValidator = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    email: z.string().email("Invalid email address"),
  })
  .strict("Unexpected field detected in request body.");
