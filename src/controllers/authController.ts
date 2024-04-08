import { NextFunction, Request, Response } from "express";
import authService from "../services/authService";
import awsService from "../services/awsService";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";

const loginUser = async (req: Request, res: Response) => {
  return res.status(200).json({ user: req.user });
};

const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = await authService.register(req.body);
    await awsService.sendVerificationEmail(newUser.id);

    return res.status(201).json({ message: "Email sent" });
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  return req.logout((err: any) => {
    if (err) next(err);
    return res.status(200).json({ message: "Logged out" });
  });
};

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const tokenToCheck = req.body["token"];

    if (!tokenToCheck) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unexpectedBody);
    }

    if (!userId) {
      throw new HttpException(HttpStatusCode.UNAUTHORIZED, APP_ERROR_CODE.notLoggedIn);
    }

    await awsService.verifyEmailToken(tokenToCheck, userId);

    return res.status(200).json({ message: "Email Verified" });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  loginUser,
  logoutUser,
  verifyEmail,
  registerUser,
};
