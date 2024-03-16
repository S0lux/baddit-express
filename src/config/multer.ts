import { CloudinaryStorage, OptionCallback, Options } from "multer-storage-cloudinary";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

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
    public_id: (req, file) => "avatar_" + req.user!.username,
  },
};

export default new CloudinaryStorage(multerOpts);
