import { NextFunction, Request, Response } from "express";
import communityService from "../services/communityService";
import postService from "../services/postService";
import { z } from "zod";
import { postBodyValidator } from "../validators/schemas/postBody";
import { votePostBodyValidator } from "../validators/schemas/votePostBody";
import { reformatters } from "../utils/reformatters";
import commentService from "../services/commentService";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!.id;
  const { title, content, type }: z.infer<typeof postBodyValidator> = req.body;
  try {
    const communityName = req.body["communityName"] as string | undefined;
    // Validate community name
    // If not found, communityService throws error
    var community = undefined;
    if (communityName !== undefined)
      community = await communityService.getCommunityByName(communityName);

    // Create post
    await postService.createPost(
      title,
      content,
      type,
      userId,
      community,
      req.files as Express.Multer.File[]
    );

    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.params["postId"];
  const user = req.user!;

  try {
    const post = await postService.getPostsWithQueries({ postId });
    var community = undefined,
      userCommunityRole = null;
    if (post[0].communityName) {
      community = await communityService.getCommunityByName(post[0].communityName);
      userCommunityRole = await communityService.getUserCommunityRole(user.id, community.id);
    }
    // Delete post
    await postService.deletePost(postId, post, user, userCommunityRole);
    //delete all comments of post
    await commentService.deleteAllCommentOfPost(postId);
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};

const getPostsWithQueries = async (req: Request, res: Response, next: NextFunction) => {
  const cursor = req.query.cursor as string | undefined;
  const authorName = req.query.authorName as string | undefined;
  const postId = req.query.postId as string | undefined;
  const requesterId = req.user?.id;
  const communityName = req.query.communityName as string | undefined;
  const postTitle = req.query.postTitle as string | undefined;
  const orderByScore = req.query.orderByScore as string | undefined;

  try {
    const posts = await postService.getPostsWithQueries({
      requesterId,
      authorName,
      postId,
      communityName,
      cursor,
      postTitle,
      orderByScore,
    });

    res.status(200).json(reformatters.reformatPosts(posts));
  } catch (err) {
    next(err);
  }
};

const votePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user!;

    const { postId, state }: z.infer<typeof votePostBodyValidator> = {
      postId: req.params["postId"],
      state: req.body.state,
    };

    // Check if post exists
    const post = await postService.getPostsWithQueries({ postId, requesterId: id });
    await postService.overrideVoteState(id, post[0], state);
    res.status(200).json({ message: "Vote state updated" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const removeVote = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user!;
  const postId = req.params["postId"];

  try {
    // Check if post exists
    const post = await postService.getPostsWithQueries({ postId, requesterId: id });
    await postService.overrideVoteState(id, post[0]);
    res.status(200).json({ message: "Vote state removed" });
  } catch (err) {
    next(err);
  }
};

const editTextPostContent = async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.params["postId"];
  const content = req.body.content;
  const user = req.user!;

  try {
    const post = await postService.getPostsWithQueries({ postId });
    await postService.editTextPostContent(post[0], content, user);

    res.status(200).json({ message: "Post content updated" });
  } catch (err) {
    next(err);
  }
};

export const postController = {
  createPost,
  votePost,
  removeVote,
  deletePost,
  editTextPostContent,
  getPostsWithQueries,
};
