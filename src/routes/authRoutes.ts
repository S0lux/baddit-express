import express from "express";
import { authController } from "../controllers/authController";
import passport from "passport";

const router = express.Router();

router.post("/login", passport.authenticate("local"), authController.loginUser);
router.post("/signup", authController.registerUser);
router.post("/logout", authController.logoutUser);

router.get("/status", (req, res) =>
  res.status(200).json({ user: req.user, session: req.session })
); // For debugging, remove in production

export default router;
