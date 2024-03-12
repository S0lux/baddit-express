import {
  CloudinaryStorage,
  OptionCallback,
  Options,
} from "multer-storage-cloudinary";

const cloudinary = require("./cloudinary");

declare interface cloudinaryOptions extends Options {
  params: {
    folder: string;
    public_id: OptionCallback<string> | undefined;
  };
}

const multerOpts: cloudinaryOptions = {
  cloudinary: cloudinary,
  params: {
    folder: "avatar",
    public_id: (req, file) => "avatar_" + req.body.username,
  },
};

export const storage = new CloudinaryStorage(multerOpts);
