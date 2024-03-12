import multer from "multer";
import { storage } from "../config/multer";

export const parser = multer({ storage: storage });
