import express from "express";
import { commentController } from "../controllers/commentController";
import { commentValidator } from "../validators/commentValidators";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Comments
 *  description: Comment related routes
 */

/**
 * @swagger
 * /v1/comments:
 *  get:
 *   summary: Get comments with queries
 *   description: Get comments with queries
 *   tags: [Comments]
 *   parameters:
 *    - in: query
 *      name: cursor
 *      schema:
 *        type: string | undefined
 *    - in: query
 *      name: postId
 *      schema:
 *        type: string | undefined
 *    - in: query
 *      name: commentId
 *      schema:
 *          type: string | undefined
 *    - in: query
 *      name: authorName
 *      schema:
 *          type: string | undefined
 *   responses:
 *    200:
 *     description: Comments retrieved successfully
 *    500:
 *     description: Internal server error
 */
router.get("/", commentController.getCommentsWithQueries);

router.use(ensureAuthenticated);

/**
 * @swagger
 * /v1/comments:
 *  post:
 *   summary: Create comments
 *   description: Create comments
 *   tags: [Comments]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *         content:
 *              type: string
 *              description: The content of comment
 *              example: Peppa is super fat
 *         postId:
 *              type: string
 *              description: The id of post of this comment
 *         parentId:
 *              type: string
 *              description: The id of comment is replied by this comment
 *
 *   responses:
 *    200:
 *     description: Comments created successfully
 *    400:
 *     description: Bad request
 *    500:
 *     description: Internal server error
 */
router.post("/", commentController.createComment);

/**
 * @swagger
 * /v1/comments:
 *  put:
 *   summary: Edit comment's content
 *   description: Edit comment's content
 *   tags: [Comments]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *         content:
 *              type: string
 *              description: The content of comment
 *              example: Peppa is super fat
 *         commentId:
 *              type: string
 *              description: The id of post of this comment
 *
 *   responses:
 *    201:
 *     description: Comments created successfully
 *    500:
 *     description: Internal server error
 */
router.put("/", commentController.editTextPostContent);

/**
 * @swagger
 * /v1/comments/{commmentId}:
 *  delete:
 *   summary: Delete comment
 *   description: Delete comment
 *   tags: [Comments]
 *
 *   responses:
 *    200:
 *     description: Comments created successfully
 *    500:
 *     description: Internal server error
 */
router.delete("/:commentId", commentController.deleteComment);
/**
 * @swagger
 * /v1/comments/votes:
 *  post:
 *   summary: Vote comment
 *   description: Vote comment
 *   tags: [Comments]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       properties:
 *         commentId:
 *              type: string
 *              description: The id of comment
 *         state:
 *              type: string
 *              enum: [UPVOTE,DOWNVOTE]
 *              description: The state of vote
 *   responses:
 *    201:
 *     description: Vote State Updated Successfully
 *    400:
 *     description: Invalid request body
 *    401:
 *     description: User not authenticated
 *    500:
 *     description: Internal server error
 */
router.post("/votes", commentValidator.vote, commentController.voteComment);
export default router;
