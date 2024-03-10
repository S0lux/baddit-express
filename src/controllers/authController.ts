import { Request, Response } from "express";
import {
  loginBodyValidator,
  registerBodyValidator,
} from "../validators/authValidators";
import authService from "../services/authService";
import { handleServiceError } from "../utils/handleServiceError";

const loginUser = async (req: Request, res: Response) => {
  const parsedResult = loginBodyValidator.safeParse(req.body);

  if (!parsedResult.success) {
    return res.status(400).json({
      error: { code: "BAD_REQUEST", message: "Invalid request body" },
    });
  }

  try {
    const { username, password } = parsedResult.data;
    const session_id = await authService.login(username, password);

    // If login is successful, set the session_id cookie with httponly
    return res
      .status(200)
      .cookie("session_id", session_id, {
        httpOnly: true,
        secure: true,
        domain: process.env.DOMAIN,
      })
      .json({ message: "Login successful" });
  } catch (error: any) {
    handleServiceError(res, error);
  }
};

const registerUser = async (req: Request, res: Response) => {
  const parsedResult = registerBodyValidator.safeParse(req.body);

  if (!parsedResult.success) {
    return res.status(400).json({
      error: { code: "BAD_REQUEST", message: "Invalid request body" },
    });
  }

  const { username, password, email, avatar } = parsedResult.data;

  try {
    await authService.register(username, password, email, avatar);

    return res.status(201).json({ message: "Email sent" });
  } catch (error) {
    handleServiceError(res, error);
  }
};

export const authController = {
  loginUser,
  registerUser,
};
