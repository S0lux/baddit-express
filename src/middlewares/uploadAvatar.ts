import multer from "multer";
import storage from "../config/multer";
import { NextFunction, Request, Response } from "express";

const avatarParser = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are accepted."));
    }
  },
});

export function uploadAvatar(req: Request, res: Response, next: NextFunction) {
  avatarParser.single("avatar")(req, res, (err) => {
    if (err) {
      console.log("HELLO");
      return res.status(400).json({
        error: {
          code: "INVALID_FILE",
          message: "Only image files are accepted.",
        },
      });
    } else {
      return next();
    }
  });
}
