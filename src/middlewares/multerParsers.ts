import multer, { MulterError } from "multer";
import storage from "../config/multer";

export const avatarParser = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new MulterError("LIMIT_UNEXPECTED_FILE", "Only images are allowed"));
    }
  },
});
