import express from "express";
import { postController } from "../controllers/postController";
import { postMediaParser } from "../middlewares/multerParsers";
import { postValidators } from "../validators/postValidators";
import ensureEmailVerified from "../middlewares/ensureEmailVerified";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Posts
 *  description: Post related routes
 */

/**
 * @swagger
 * /v1/posts:
 *  get:
 *   summary: Get posts with queries
 *   description: Get posts with queries
 *   tags: [Posts]
 *   parameters:
 *    - in: query
 *      name: cursor
 *      schema:
 *        type: string
 *    - in: query
 *      name: authorId
 *      schema:
 *        type: string
 *    - in: query
 *      name: postId
 *      schema:
 *        type: string
 *    - in: query
 *      name: communityId
 *      schema:
 *        type: string
 *   responses:
 *    200:
 *     description: Posts retrieved successfully
 *    500:
 *     description: Internal server error
 */
router.get("/", postController.getPostsWithQueries);

router.use(ensureEmailVerified);

/**
 * @swagger
 * /v1/posts:
 *  post:
 *   summary: Create a post
 *   description: Create a new post in a community
 *   tags: [Posts]
 *   requestBody:
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        title:
 *         type: string
 *         description: Title of the post
 *         example: How to learn programming
 *         required: true
 *        content:
 *         type: string
 *         description: Content of the post
 *         example: This is a post about how to learn programming
 *        type:
 *         type: string
 *         enum: [TEXT, LINK, MEDIA]
 *         description: Type of the post
 *         example: TEXT
 *         required: true
 *        communityName:
 *         type: string
 *         description: The name of the community
 *         example: programming
 *         required: true
 *        files:
 *         type: array
 *         items:
 *          type: string
 *          format: binary
 *          description: Media files
 *          example: [media1.jpg, media2.mp4]
 *   responses:
 *    201:
 *     description: Post created successfully
 *    400:
 *     description: Unexpected body or missing media if type is MEDIA
 *    401:
 *     description: User not authenticated
 *    404:
 *     description: Community not found
 *    500:
 *     description: Internal server error
 */
router.post("/", postMediaParser.array("files"), postValidators.create, postController.createPost);

/**
 * @swagger
 * /v1/posts/{postId}:
 *  delete:
 *   summary: Delete a post
 *   description: Delete a post in a community
 *   tags: [Posts]
 *   parameters:
 *    - in: path
 *      name: postId
 *      schema:
 *       type: string
 *       required: true
 *       description: The id of the post
 *      required: true
 *      description: The id of the post
 *   responses:
 *    200:
 *     description: Post deleted successfully
 *    401:
 *     description: Insufficient permissions
 *    404:
 *     description: Post not found
 *    500:
 *     description: Internal server error
 */
router.delete("/:postId", postController.deletePost);

/**
 * @swagger
 * /v1/posts/{postId}:
 *  put:
 *   summary: Edit a post
 *   description: Edit a post in a community, only the author of the post can edit it and media posts cannot be edited
 *   tags: [Posts]
 *   parameters:
 *    - in: path
 *      name: postId
 *      schema:
 *       type: string
 *       required: true
 *       description: The id of the post
 *      required: true
 *      description: The id of the post
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        content:
 *         type: string
 *         description: New content of the post
 *         example: This is the new content of the post
 *   responses:
 *    200:
 *     description: Post edited successfully
 *    401:
 *     description: Insufficient permissions
 *    404:
 *     description: Post not found
 *    500:
 *     description: Internal server error
 *
 */
router.put("/:postId", postController.editTextPostContent);

/**
 * @swagger
 * /v1/posts/{postId}/votes:
 *  post:
 *   summary: Vote a post
 *   description: Vote a post in a community
 *   tags: [Posts]
 *   parameters:
 *    - in: path
 *      name: postId
 *      schema:
 *       type: string
 *       required: true
 *       description: The id of the post
 *      required: true
 *      description: The id of the post
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *        state:
 *         type: string
 *         enum: [UPVOTE, DOWNVOTE]
 *         description: Vote state
 *         example: UPVOTE
 *         required: true
 *   responses:
 *    200:
 *     description: Vote state updated
 *    400:
 *     description: Invalid vote state
 *    401:
 *     description: User not authenticated
 *    404:
 *     description: Post not found
 *
 */
router.post("/:postId/votes", postValidators.vote, postController.votePost);

/**
 * @swagger
 * /v1/posts/{postId}/votes:
 *  delete:
 *   summary: Remove vote from a post
 *   description: Remove vote from a post in a community
 *   tags: [Posts]
 *   parameters:
 *    - in: path
 *      name: postId
 *      schema:
 *       type: string
 *       required: true
 *       description: The id of the post
 *       example: 123456
 *      required: true
 *      description: The id of the post
 *      example: 123456
 *   responses:
 *    200:
 *     description: Vote removed
 *    401:
 *     description: User not authenticated
 *    404:
 *     description: Post not found
 *    500:
 *     description: Internal server error
 *
 */
router.delete("/:postId/votes", postController.removeVote);

export default router;
