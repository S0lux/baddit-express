import express from "express";
import { userController } from "../controllers/userController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import { uploadAvatar } from "../middlewares/uploadAvatar";

const router = express.Router();

router.get("/me", ensureAuthenticated, userController.getMe);
router.post(
  "/avatar",
  ensureAuthenticated,
  uploadAvatar,
  userController.updateAvatar
);

export default router;
