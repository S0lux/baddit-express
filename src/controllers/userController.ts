import { Request, Response } from "express";
import { handleServiceError } from "../utils/handleServiceError";
import userService from "../services/userService";

const getMe = (req: Request, res: Response) => {
  return res.status(200).json({ user: req.user });
};

const updateAvatar = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw {
        status: 400,
        code: "NO_FILE_PROVIDED",
        message: "No file provided.",
      };
    }

    userService.updateUserAvatar(req.user!.id, req.file.path);

    return res.status(200).json({ avatar: req.file.path });
  } catch (error) {
    handleServiceError(res, error);
  }
};

export const userController = {
  getMe,
  updateAvatar,
};
