import express from "express";
import { authController } from "../controllers/authController";
import passport, { AuthenticateOptions } from "passport";
import handleAuthError from "../middlewares/handleAuthError";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
const router = express.Router();

const authenticateOptions: AuthenticateOptions = {
  failWithError: true,
};

// If a login failed due to invalid credentials, the error will be handled by the handleAuthError middleware
// Otherwise the user object will be available in future request objects
router.post(
  "/login",
  passport.authenticate("local", authenticateOptions),
  authController.loginUser,
  handleAuthError
);

router.post("/verification", authController.verifyEmail);

router.post("/signup", authController.registerUser);
router.post("/logout", authController.logoutUser);

export default router;
