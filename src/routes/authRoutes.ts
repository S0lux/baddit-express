import express from "express";
import { authController } from "../controllers/authController";

const router = express.Router();

router.post("/login", authController.loginUser);
router.post("/signup", authController.registerUser);

export default router;
