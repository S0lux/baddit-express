import { NextFunction, Request, Response } from "express";
import communityService from "../services/communityService";
import postService from "../services/postService";
import { PostType } from "@prisma/client";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  const username = req.user!.username;
  const { title, content, type, communityName } = req.body;

  try {
    // Validate community name
    // If not found, communityService throws error
    const community = await communityService.getCommunityByName(communityName);

    // Build post data
    let postData;

    if (type === PostType.TEXT || type === PostType.LINK) {
      postData = {
        title,
        content,
        type,
        authorName: username,
        communityName: community.name,
      };
    } else {
      // Validate media files
      if (!req.files || req.files.length === 0) {
        throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.missingMedia);
      }

      const files = req.files as Express.Multer.File[];
      const mediaUrls = files.map((file) => file.path);

      // Build post data
      postData = {
        title,
        content: "",
        type,
        authorName: username,
        communityName: community.name,
        mediaUrls: mediaUrls,
      };
    }

    // Create post
    await postService.createPost(postData);

    res.status(201).json({ message: "Post created successfully" });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.params["postId"];
  const user = req.user!;

  try {
    // Check if post exists
    const post = await postService.getPostsWithQueries({ postId });
    const community = await communityService.getCommunityByName(post[0].communityName);
    const userCommunityRole = await communityService.getUserCommunityRole(user.id, community.id);

    // Check if user is the author of the post
    if (
      post[0].authorName !== user.username &&
      user.role !== "ADMIN" &&
      userCommunityRole?.communityRole !== "MODERATOR"
    ) {
      throw new HttpException(HttpStatusCode.FORBIDDEN, APP_ERROR_CODE.insufficientPermissions);
    }

    // Delete post
    await postService.deletePost(postId);

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    next(err);
  }
};

const getPostsWithQueries = async (req: Request, res: Response, next: NextFunction) => {
  const cursor = req.query.cursor as string | undefined;
  const authorId = req.query.authorId as string | undefined;
  const postId = req.query.postId as string | undefined;
  const requesterId = req.user?.id;
  const communityId = req.query.communityId as string | undefined;

  try {
    const posts = await postService.getPostsWithQueries({
      requesterId,
      authorId,
      postId,
      communityId,
      cursor,
    });

    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

const votePost = async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.params["postId"];
  const userId = req.user!.id;
  const userName = req.user!.username;
  const state = req.body.state;

  try {
    if (state !== "UPVOTE" && state !== "DOWNVOTE") {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unknownVoteState);
    }

    // Check if post exists
    const post = await postService.getPostsWithQueries({ postId, requesterId: userId });

    // Check if user has voted before
    const previousState = post[0]?.vote[0]?.state;

    // Create or update vote state
    await postService.overrideVoteState(userName, postId, state);

    // Update post score if user has voted before
    if (previousState) {
      if (previousState === "UPVOTE" && state === "DOWNVOTE") {
        await postService.updatePostScore(postId, post[0].score - 2);
      } else if (previousState === "DOWNVOTE" && state === "UPVOTE") {
        await postService.updatePostScore(postId, post[0].score + 2);
      }
    } else {
      // Update post score if user has not voted before
      if (state === "UPVOTE") {
        await postService.updatePostScore(postId, post[0].score + 1);
      } else {
        await postService.updatePostScore(postId, post[0].score - 1);
      }
    }

    res.status(200).json({ message: "Vote state updated" });
  } catch (err) {
    next(err);
  }
};

const removeVote = async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.params["postId"];
  const username = req.user!.username;
  const userId = req.user!.id;

  try {
    // Check if post exists
    const post = await postService.getPostsWithQueries({ postId, requesterId: userId });
    const previousState = post[0]?.vote[0]?.state;

    // Remove vote
    await postService.overrideVoteState(username, postId);

    // Update score
    if (previousState === "UPVOTE") {
      await postService.updatePostScore(postId, post[0].score - 1);
    } else await postService.updatePostScore(postId, post[0].score + 1);

    res.status(200).json({ message: "Vote removed" });
  } catch (err) {
    next(err);
  }
};

const editTextPostContent = async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.params["postId"];
  const content = req.body.content;
  const user = req.user!;

  try {
    if (content === "") {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unexpectedBody);
    }

    const post = await postService.getPostsWithQueries({ postId });

    if (post[0].type === PostType.MEDIA) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        APP_ERROR_CODE.mediaPostEditingUnsupported
      );
    }

    if (post[0].authorName !== user.username) {
      throw new HttpException(HttpStatusCode.FORBIDDEN, APP_ERROR_CODE.insufficientPermissions);
    }

    await postService.editTextPostContent(postId, content);

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
