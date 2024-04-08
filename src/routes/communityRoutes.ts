import express from "express";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";
import { communityController } from "../controllers/communityController";
import { communityValidators } from "../validators/communityValidators";
import { postValidators } from "../validators/postValidators";
import { postController } from "../controllers/postController";
import { postMediaParser } from "../middlewares/multerParsers";

const router = express.Router();

router.get("/:communityName", communityController.getCommunity);
router.get("/:communityName/posts", postController.getPostsInCommunity);

// Get a specific post with all its comments
// router.get("/:communityName/posts/:postId", postController.getPost);

router.use(ensureAuthenticated);

router.post("/", communityValidators.create, communityController.createCommunity);
router.post("/:communityName/member", communityController.joinCommunity);

// Post upload
router.post(
  "/:communityName/posts",
  postMediaParser.array("files"),
  postValidators.create,
  postController.createPost
);

router.delete("/:communityName/posts/:postId", postController.deletePost);

router.put("/:communityName/posts/:postId", postController.editTextPostContent);

// Post voting
router.post("/:communityName/posts/:postId/votes", postController.votePost);
router.delete("/:communityName/posts/:postId/votes", postController.removeVote);

export default router;
