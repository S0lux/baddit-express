import multer, { MulterError } from "multer";
import storage from "../config/multer";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";

export const avatarParser = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.onlyImageAllowed));
    }
  },
});
