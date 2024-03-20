import { NextFunction, Request, Response } from "express";
import authService from "../services/authService";
import { handleServiceError } from "../utils/handleServiceError";
import awsService from "../services/awsService";

const loginUser = async (req: Request, res: Response) => {
  return res.status(200).json({ user: req.user });
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const newUser = await authService.register(req.body);
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
  try {
    const userId = req.user?.id;
    const tokenToCheck = req.body["token"];

    if (!tokenToCheck) {
      throw {
        status: 400,
        code: "BAD_REQUEST",
        message: "Missing token in request body",
      };
    }

    if (!userId) {
      throw {
        status: 401,
        code: "INVALID_CREDENTIALS",
        message: "You need to be logged in to verify your account",
      };
    }

    await awsService.verifyEmailToken(tokenToCheck, userId);

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
