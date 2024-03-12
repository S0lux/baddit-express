import express from "express";
import { userController } from "../controllers/userController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import { parser } from "../middlewares/avatarUpload";

const router = express.Router();

router.get("/me", ensureAuthenticated, userController.getMe);
router.post(
  "/updateAvatar",
  ensureAuthenticated,
  parser.single("avatar"),
  userController.updateAvatar
);
