import { NextFunction, Request, Response } from "express";
import userService from "../services/userService";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";

const getMe = (req: Request, res: Response) => {
  const user = req.user;

  if (!user?.id) {
    throw new HttpException(HttpStatusCode.UNAUTHORIZED, APP_ERROR_CODE.notLoggedIn);
  }

  res.status(200).json(user);
};

const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.missingMedia);
    }

    await userService.updateUserAvatar(req.user!.id, req.file.path);

    res.status(200).json({ message: "Avatar updated successfully" });
  } catch (err) {
    next(err);
  }
};

export const userController = {
  getMe,
  updateAvatar,
};
