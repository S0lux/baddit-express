import multer from "multer";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";
import { storage } from "../config/multer";

export const avatarParser = multer({
  storage: storage.avatarStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.onlyImageAllowed));
    }
  },
});

export const logoParser = multer({
  storage: storage.logoStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.onlyImageAllowed));
    }
  },
});

export const bannerParser = multer({
  storage: storage.bannerStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.onlyImageAllowed));
    }
  },
});

export const postMediaParser = multer({
  storage: storage.postMediaStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
      cb(null, true);
    } else {
      cb(new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.onlyImageOrVideoAllowed));
    }
  },
});
