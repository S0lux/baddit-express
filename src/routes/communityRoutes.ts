import express from "express";
import { communityController } from "../controllers/communityController";
import { communityValidators } from "../validators/communityValidators";
import { bannerParser, logoParser } from "../middlewares/multerParsers";
import ensureEmailVerified from "../middlewares/ensureEmailVerified";

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
 * /v1/communities:
 *  get:
 *   summary: Get communiteies with queries
 *   description: Get communiteies with queries
 *   tags: [Communities]
 *   parameters:
 *    - in: query
 *      name: cursor
 *      schema:
 *        type: string
 *    - in: query
 *      name: name
 *      schema:
 *        type: string
 *   responses:
 *    200:
 *     description: Communities retrieved successfully
 *    500:
 *     description: Internal server error
 */
router.get("/", communityController.getCommunitiesWithQueries);

router.use(ensureEmailVerified);

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
 * /v1/communities/{communityName}:
 *  delete:
 *   summary: Remove community
 *   description: Remove community and all posts
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
 *     description: Community has been deleted
 *    401:
 *     description: User not authenticated
 *    403:
 *     description: User has no permission
 *    404:
 *     description: Community not found
 *    500:
 *     description: Internal server error
 *
 */
router.delete("/:communityName", communityController.deleteCommunity);

/**
 * @swagger
 * /v1/communities/{communityName}/logo:
 *  post:
 *   summary: Update community logo
 *   description: Update the logo of the community
 *   tags: [Communities]
 *   requestBody:
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        logo:
 *         type: string
 *         format: binary
 *         description: The image to upload as logo
 *   responses:
 *    200:
 *     description: Logo updated successfully
 *    400:
 *     description: Missing or invalid media provided for avatar (only images are allowed)
 *    401:
 *     description: User is not logged in
 *    403:
 *     description: User has no permission
 *    404:
 *     description: Community not found
 *    500:
 *     description: Internal server error
 */
router.post(
  "/:communityName/logo",
  logoParser.single("logo"),
  communityController.updateCommunityLogo
);

/**
 * @swagger
 * /v1/communities/{communityName}/banner:
 *  post:
 *   summary: Update community banner
 *   description: Update the banner of the community
 *   tags: [Communities]
 *   requestBody:
 *    required: true
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        banner:
 *         type: string
 *         format: binary
 *         description: The image to upload as banner
 *   responses:
 *    200:
 *     description: Banner updated successfully
 *    400:
 *     description: Missing or invalid media provided for avatar (only images are allowed)
 *    401:
 *     description: User is not logged in
 *    403:
 *     description: User has no permission
 *    404:
 *     description: Community not found
 *    500:
 *     description: Internal server error
 */
router.post(
  "/:communityName/banner",
  bannerParser.single("banner"),
  communityController.updateCommunityBanner
);
export default router;
