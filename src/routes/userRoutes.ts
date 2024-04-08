import express from "express";
import { userController } from "../controllers/userController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import { avatarParser } from "../middlewares/multerParsers";

const router = express.Router();

router.get("/me", userController.getMe);
router.use(ensureAuthenticated);
router.post("/avatar", avatarParser.single("avatar"), userController.updateAvatar);

export default router;
