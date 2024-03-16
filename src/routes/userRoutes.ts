import express from "express";
import { userController } from "../controllers/userController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import { avatarParser } from "../middlewares/multerParsers";
import handleMulterError from "../middlewares/handleMulterError";

const router = express.Router();

router.use(ensureAuthenticated);
router.get("/me", userController.getMe);
router.post(
  "/avatar",
  avatarParser.single("avatar"),
  userController.updateAvatar,
  handleMulterError,
);

export default router;
