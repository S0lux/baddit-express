import express from "express";
import { authController } from "../controllers/authController";
import passport, { AuthenticateOptions } from "passport";
import handleAuthError from "../middlewares/handleAuthError";
import { authValidator } from "../validators/authValidators";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
const router = express.Router();

const authenticateOptions: AuthenticateOptions = {
  failWithError: true,
};

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Login, registration and verification related routes
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   Login:
 *    type: object
 *    required:
 *     - username
 *     - password
 *    properties:
 *     username:
 *      type: string
 *      description: Username of the user
 *     password:
 *      type: string
 *      description: Password of the user
 *    example:
 *     username: tranloc
 *     password: 12345678a
 *   Signup:
 *    type: object
 *    required:
 *     - username
 *     - password
 *     - email
 *    properties:
 *     username:
 *      type: string
 *      description: Username of the user
 *     password:
 *      type: string
 *      description: Password of the user
 *     email:
 *      type: string
 *      description: Email of the user
 *    example:
 *     username: tranloc
 *     password: 12345678a
 *     email: loctranphuoc123@gmail.com
 *   User:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *     username:
 *      type: string
 *     email:
 *      type: string
 *     avatarUrl:
 *      type: string
 *     emailVerified:
 *      type: boolean
 *     registeredAt:
 *      type: string
 *      format: date-time
 *     role:
 *      type: string
 *   Token:
 *    type: object
 *    required:
 *     - token
 *    properties:
 *     token:
 *      type: string
 *      description: The token sent to the user's email
 *    example:
 *     token: aw1232hwfisdu91ued2w7yr2
 *
 */

/**
 * @swagger
 *
 * /v1/auth/login:
 *  post:
 *   summary: Login user
 *   description: Login user with username and password
 *   tags: [Authentication]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Login'
 *   responses:
 *    200:
 *     description: User logged in successfully
 *    401:
 *     description: Invalid credentials
 *    500:
 *     description: Internal server error
 */
router.post(
  "/login",
  passport.authenticate("local", authenticateOptions),
  authController.loginUser,
  handleAuthError
);

/**
 * @swagger
 * /v1/auth/verification:
 *  post:
 *   summary: Verify email
 *   description: Verify email with token
 *   tags: [Authentication]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Token'
 *   responses:
 *    200:
 *     description: Verified email successfully
 *    400:
 *     description: Invalid request body
 *    401:
 *     description: User not logged in to verify email
 *    498:
 *     description: Token expired or invalid
 *    500:
 *     description: Internal server error
 */
router.post("/verification", authValidator.emailToken, authController.verifyEmail);

/**
 * @swagger
 * /v1/auth/signup:
 *  post:
 *   summary: Register user
 *   description: Register user with username, password and email
 *   tags: [Authentication]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Signup'
 *   responses:
 *    201:
 *     description: User registered successfully
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/User'
 *    400:
 *     description: Invalid request body
 *    409:
 *     description: Username or email already taken
 *    500:
 *     description: Internal server error
 */
router.post("/signup", authValidator.register, authController.registerUser);

router.use(ensureAuthenticated);

/**
 * @swagger
 * /v1/auth/verification:
 *  get:
 *   summary: Request new verification email
 *   description: Request new verification email to be sent to the user's email
 *   tags: [Authentication]
 *   responses:
 *    200:
 *     description: Email sent
 *    401:
 *     description: User not logged in or email already verified
 *    500:
 *     description: Internal server error
 */
router.get("/verification", authController.resendVerificationEmail);

/**
 * @swagger
 * /v1/auth/logout:
 *  post:
 *   summary: Logout user
 *   description: Logout user who is logged in
 *   tags: [Authentication]
 *   responses:
 *    200:
 *     description: User logged out successfully
 *    401:
 *     description: User not logged in
 *    500:
 *     description: Internal server error
 */
router.post("/logout", authController.logoutUser);

/**
 * @swagger
 * /v1/auth/update-password:
 *  patch:
 *   summary: Update password
 *   description: Update password of the user
 *   tags: [Authentication]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - oldPassword
 *        - newPassword
 *       properties:
 *        oldPassword:
 *         type: string
 *         description: Old password of the user
 *        newPassword:
 *         type: string
 *         description: New password of the user
 *   responses:
 *    200:
 *     description: Password updated successfully
 *    400:
 *     description: Invalid request body
 *    401:
 *     description: Wrong old password or user not logged in
 *    404:
 *     description: User not found
 *    500:
 *     description: Internal server error
 *
 */
router.patch("/update-password", authController.updatePassword);

export default router;
