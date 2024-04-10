import express from "express";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import { communityController } from "../controllers/communityController";
import { communityValidators } from "../validators/communityValidators";
import { postValidators } from "../validators/postValidators";
import { postController } from "../controllers/postController";
import { postMediaParser } from "../middlewares/multerParsers";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Communities
 *  description: Community related routes
 */

/**
 * @swagger
 * tags:
 *  name: Posts
 *  description: Post related routes
 */

/**
 * @swagger
 * components:
 *  schemas:
 *   Community:
 *    type: object
 *    properties:
 *     name:
 *      type: string
 *      description: Name of the community
 *      example: programming
 *     description:
 *      type: string
 *      description: Description of the community
 *      example: A community for programmers
 *     ownerId:
 *      type: string
 *      description: Id of the owner of the community
 *     logoUrl:
 *      type: string
 *      description: URL of the logo of the community
 *     bannerUrl:
 *      type: string
 *      description: URL of the banner of the community
 *     status:
 *      type: string
 *      enum: [STANDARD, SUSPENDED]
 *      description: Status of the community
 *     createdAt:
 *      type: string
 *      format: date-time
 *      description: Date and time of the creation of the community
 *   Post:
 *    type: object
 *    properties:
 *     id:
 *      type: string
 *      description: Id of the post
 *     title:
 *      type: string
 *      description: Title of the post
 *     content:
 *      type: string
 *      description: Content of the post
 *     type:
 *      type: string
 *      enum: [TEXT, LINK, MEDIA]
 *      description: Type of the post
 *     mediaUrls:
 *      type: array
 *      items:
 *       type: string
 *       description: URL of the media
 *       example: [https://example.com/media.jpg, https://example.com/media.mp4]
 *     authorName:
 *      type: string
 *      description: Name of the author of the post
 *     communityName:
 *      type: string
 *      description: Name of the community of the post
 *     score:
 *      type: number
 *      description: Score of the post
 *     createdAt:
 *      type: string
 *      format: date-time
 *      description: Date and time of the creation of the post
 *     updatedAt:
 *      type: string
 *      format: date-time
 *      description: Date and time of the last update of the post
 *     deleted:
 *      type: boolean
 *      description: Whether the post is deleted
 *   CommunityCreate:
 *    type: object
 *    required:
 *     - name
 *     - description
 *    properties:
 *     name:
 *      type: string
 *      description: Name of the community
 *      example: programming
 *     description:
 *      type: string
 *      description: Description of the community
 *      example: A community for programmers
 *   PostCreate:
 *    type: object
 *    required:
 *     - title
 *     - content
 *     - type
 *    properties:
 *     title:
 *      type: string
 *      description: Title of the post
 *      example: How to learn programming
 *     content:
 *      type: string
 *      description: Content of the post
 *      example: This is a post about how to learn programming
 *     type:
 *      type: string
 *      enum: [TEXT, LINK, MEDIA]
 *      description: Type of the post
 *      example: TEXT
 *
 */

/**
 * @swagger
 * /v1/communities/{communityName}:
 *  get:
 *   summary: Get a community
 *   description: Get information of a community
 *   tags: [Communities]
 *   parameters:
 *    - in: path
 *      name: communityName
 *      schema:
 *       type: string
 *      required: true
 *      description: The name of the community
 *      example: programming
 *   responses:
 *    200:
 *     description: Information of the community
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/Community'
 *    404:
 *     description: Community not found
 *    500:
 *     description: Internal server error
 *
 */
router.get("/:communityName", communityController.getCommunity);

/**
 * @swagger
 * /v1/communities/{communityName}/posts:
 *  get:
 *   summary: Get posts in a community
 *   description: Get all posts in a community
 *   tags: [Communities]
 *   parameters:
 *    - in: path
 *      name: communityName
 *      schema:
 *       type: string
 *      required: true
 *      description: The name of the community
 *      example: programming
 *    - in: query
 *      name: cursor
 *      schema:
 *       type: string
 *       description: The id of the last post in the previous page
 *      required: false
 *   responses:
 *    200:
 *     description: Posts in the community
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *        items:
 *         $ref: '#/components/schemas/Post'
 *    404:
 *     description: Community not found
 *    500:
 *     description: Internal server error
 *
 */
router.get("/:communityName/posts", postController.getPostsInCommunity);

// Get a specific post with all its comments
// router.get("/:communityName/posts/:postId", postController.getPost);

router.use(ensureAuthenticated);

/**
 * @swagger
 * /v1/communities:
 *  post:
 *   summary: Create a community
 *   description: Create a new community
 *   tags: [Communities]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/CommunityCreate'
 *   responses:
 *    201:
 *     description: Community created
 *    400:
 *     description: Unexpected body
 *    401:
 *     description: User not authenticated
 *    500:
 *     description: Internal server error
 */
router.post("/", communityValidators.create, communityController.createCommunity);

/**
 * @swagger
 * /v1/communities/{communityName}/members:
 *  post:
 *   summary: Join a community
 *   description: Join a community
 *   tags: [Communities]
 *   parameters:
 *    - in: path
 *      name: communityName
 *      schema:
 *       type: string
 *       required: true
 *       description: The name of the community
 *       example: programming
 *      required: true
 *      description: The name of the community
 *      example: programming
 *   responses:
 *    200:
 *     description: User joined the community successfully
 *    401:
 *     description: User not authenticated
 *    404:
 *     description: Community not found
 *    500:
 *     description: Internal server error
 *
 */
router.post("/:communityName/members", communityController.joinCommunity);

/**
 * @swagger
 * /v1/communities/{communityName}/posts:
 *  post:
 *   summary: Create a post
 *   description: Create a new post in a community
 *   tags: [Posts]
 *   parameters:
 *    - in: path
 *      name: communityName
 *      schema:
 *       type: string
 *       required: true
 *       description: The name of the community
 *       example: programming
 *      required: true
 *      description: The name of the community
 *      example: programming
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
 *        content:
 *         type: string
 *         description: Content of the post
 *         example: This is a post about how to learn programming
 *        type:
 *         type: string
 *         enum: [TEXT, LINK, MEDIA]
 *         description: Type of the post
 *         example: TEXT
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
 *
 */
router.post(
  "/:communityName/posts",
  postMediaParser.array("files"),
  postValidators.create,
  postController.createPost
);

/**
 * @swagger
 * /v1/communities/{communityName}/posts/{postId}:
 *  delete:
 *   summary: Delete a post
 *   description: Delete a post in a community
 *   tags: [Posts]
 *   parameters:
 *    - in: path
 *      name: communityName
 *      schema:
 *       type: string
 *       required: true
 *       description: The name of the community
 *       example: programming
 *      required: true
 *      description: The name of the community
 *      example: programming
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
router.delete("/:communityName/posts/:postId", postController.deletePost);

/**
 * @swagger
 * /v1/communities/{communityName}/posts/{postId}:
 *  put:
 *   summary: Edit a post
 *   description: Edit a post in a community, only the author of the post can edit it and media posts cannot be edited
 *   tags: [Posts]
 *   parameters:
 *    - in: path
 *      name: communityName
 *      schema:
 *       type: string
 *       required: true
 *       description: The name of the community
 *       example: programming
 *      required: true
 *      description: The name of the community
 *      example: programming
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
router.put("/:communityName/posts/:postId", postController.editTextPostContent);

// Post voting
/**
 * @swagger
 * /v1/communities/{communityName}/posts/{postId}/votes:
 *  post:
 *   summary: Vote a post
 *   description: Vote a post in a community
 *   tags: [Posts]
 *   parameters:
 *    - in: path
 *      name: communityName
 *      schema:
 *       type: string
 *       required: true
 *       description: The name of the community
 *      required: true
 *      description: The name of the community
 *      example: programming
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
router.post("/:communityName/posts/:postId/votes", postController.votePost);

/**
 * @swagger
 * /v1/communities/{communityName}/posts/{postId}/votes:
 *  delete:
 *   summary: Remove vote from a post
 *   description: Remove vote from a post in a community
 *   tags: [Posts]
 *   parameters:
 *    - in: path
 *      name: communityName
 *      schema:
 *       type: string
 *       required: true
 *       description: The name of the community
 *       example: programming
 *      required: true
 *      description: The name of the community
 *      example: programming
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
router.delete("/:communityName/posts/:postId/votes", postController.removeVote);

export default router;
