import express from "express";
import { userController } from "../controllers/userController";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import { avatarParser } from "../middlewares/multerParsers";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Users
 *  description: User related routes
 */

/**
 * @swagger
 * /v1/users/me:
 *  get:
 *   summary: Get logged in user information
 *   description: Get information of the user who is currently logged in
 *   tags: [Users]
 *   responses:
 *    200:
 *     description: User information
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/User'
 *    401:
 *     description: User is not logged in
 *    500:
 *     description: Internal server error
 *
 */
router.get("/me", userController.getMe);

/**
 * @swagger
 * /v1/users/{username}:
 *  get:
 *   summary: Get other user profile
 *   description: Get other user profile
 *   tags: [Users]
 *
 *   responses:
 *    200:
 *     description: Profile retrieved successfully
 *    401:
 *     description: User is not logged in
 *    404:
 *     description: User not found
 *    500:
 *     description: Internal server error
 */

router.get("/:username", userController.getOther);

/**
 * @swagger
 * /v1/users/{username}/posts:
 *  get:
 *   summary: Get other user posts
 *   description: Get other user posts
 *   tags: [Users]
 *
 *   responses:
 *    200:
 *     description: Posts retrieved successfully
 *    401:
 *     description: User is not logged in
 *    404:
 *     description: User not found
 *    500:
 *     description: Internal server error
 */
router.get("/:username/posts", userController.getOtherPosts);

/**
 * @swagger
 * /v1/users/{username}/comments:
 *  get:
 *   summary: Get other user comments
 *   description: Get other user comments
 *   tags: [Users]
 *
 *   responses:
 *    200:
 *     description: Comments retrieved successfully
 *    401:
 *     description: User is not logged in
 *    404:
 *     description: User not found
 *    500:
 *     description: Internal server error
 */

router.get("/:username/comments", userController.getOtherComments);

router.use(ensureAuthenticated);
/**
 * @swagger
 * /v1/users/avatar:
 *  post:
 *   summary: Update user avatar
 *   description: Update the avatar of the user who is currently logged in
 *   tags: [Users]
 *   requestBody:
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        avatar:
 *         type: string
 *         format: binary
 *         description: The image to upload as avatar
 *   responses:
 *    200:
 *     description: Avatar updated successfully
 *    400:
 *     description: Missing or invalid media provided for avatar (only images are allowed)
 *    401:
 *     description: User is not logged in
 *    500:
 *     description: Internal server error
 */
router.post("/avatar", avatarParser.single("avatar"), userController.updateAvatar);

export default router;
