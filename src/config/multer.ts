import { CloudinaryStorage, OptionCallback, Options } from "multer-storage-cloudinary";

const cloudinary = require("cloudinary").v2;
var randomstring = require("randomstring");

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

const multerAvatarOpts: cloudinaryOptions = {
  cloudinary: cloudinary,
  params: {
    folder: "avatar",
    public_id: (req, file) => "avatar_" + req.user!.username,
  },
};

const multerLogoOpts: cloudinaryOptions = {
  cloudinary: cloudinary,
  params: {
    folder: "logo",
    public_id: (req, file) => "logo_" + req.params["communityName"],
  },
};

const multerBannerOpts: cloudinaryOptions = {
  cloudinary: cloudinary,
  params: {
    folder: "banner",
    public_id: (req, file) => "banner_" + req.params["communityName"],
  },
};

const postMediaOpts: cloudinaryOptions = {
  cloudinary: cloudinary,
  params: {
    folder: "posts",
    public_id: (req, file) => "post_" + randomstring.generate(10),
  },
};

export const storage = {
  avatarStorage: new CloudinaryStorage(multerAvatarOpts),
  logoStorage: new CloudinaryStorage(multerLogoOpts),
  bannerStorage: new CloudinaryStorage(multerBannerOpts),
  postMediaStorage: new CloudinaryStorage(postMediaOpts),
};
