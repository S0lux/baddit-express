import { Request, Response } from "express";
import { handleServiceError } from "../utils/handleServiceError";
import userService from "../services/userService";

const getMe = (req: Request, res: Response) => {
  res.status(200).json({ user: req.user });
};

const updateAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      throw new Error("Avatar is required");
    }

    await userService.updateUserAvatar(req.user!.id, req.file.path);

    res.status(200).json({ message: "Avatar updated successfully" });
  } catch (err) {
    handleServiceError(res, err);
  }
};

export const userController = {
  getMe,
  updateAvatar,
};
