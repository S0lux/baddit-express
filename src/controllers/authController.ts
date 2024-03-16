import { NextFunction, Request, Response } from "express";
import { registerBodyValidator } from "../validators/authValidators";
import authService from "../services/authService";
import { handleServiceError } from "../utils/handleServiceError";
import awsService from "../services/awsService";

const loginUser = async (req: Request, res: Response) => {
  return res.status(200).json({ user: req.user });
};

const registerUser = async (req: Request, res: Response) => {
  const parsedResult = registerBodyValidator.safeParse(req.body);

  if (!parsedResult.success) {
    return res.status(400).json({
      error: { code: "BAD_REQUEST", message: "Invalid request body" },
    });
  }

  try {
    const newUser = await authService.register(parsedResult.data);
    await awsService.sendVerificationEmail(newUser.id);
    return res.status(201).json({ message: "Email sent" });
  } catch (error) {
    handleServiceError(res, error);
  }
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  return req.logout((err: any) => {
    if (err) next(err);
    return res.status(200).json({ message: "Logged out" });
  });
};

const verifyEmail = async (req: Request, res: Response) => {
  const tokenToCheck = req.body["token"];
  try {
    await awsService.verifyEmailToken(tokenToCheck, req.user!.id);
    return res.status(200).json({ message: "Email Verified" });
  } catch (err) {
    handleServiceError(res, err);
  }
};

export const authController = {
  loginUser,
  logoutUser,
  verifyEmail,
  registerUser,
};
