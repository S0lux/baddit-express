import express from "express";
import { commentController } from "../controllers/commentController";
import ensureEmailVerified from "../middlewares/ensureEmailVerified";
import { commentValidator } from "../validators/commentValidators";

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
 *        type: string
 *    - in: query
 *      name: parentId
 *      schema:
 *          type: string | undefined
 *    - in: query
 *      name: authorId
 *      schema:
 *          type: string | undefined
 *   responses:
 *    200:
 *     description: Comments retrieved successfully
 *    500:
 *     description: Internal server error
 */
router.get("/", commentController.getCommentsWithQueries);

router.use(ensureEmailVerified);

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
 *    500:
 *     description: Internal server error
 */

router.post("/", commentController.createComment);

router.put("/", commentController.editTextPostContent);

router.delete("/:commentId", commentController.deleteComment);

router.post("/votes", commentValidator.vote, commentController.voteComment);
router.delete("/:commentId/votes", commentController.removeVote);
export default router;
