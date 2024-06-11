import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { commentBodyValidator } from "../validators/schemas/commentBody";
import commentService from "../services/commentService";
import { postRepository } from "../repositories/postRepositorry";
import communityService from "../services/communityService";
import { voteCommentBodyValidator } from "../validators/schemas/voteCommentBody";
import { reformatters } from "../utils/reformatters";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";
import userService from "../services/userService";

const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!.id;
  const { content, postId, parentId }: z.infer<typeof commentBodyValidator> = req.body;
  try {
    if (!postId) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unexpectedBody);
    }
    await commentService.createComment(
      content,
      userId,
      postId as string | undefined,
      parentId as string | undefined
    );
    res.status(201).json({ message: "Comment created successfully" });
  } catch (err) {
    next(err);
  }
};

const getCommentsWithQueries = async (req: Request, res: Response, next: NextFunction) => {
  const postId = req.query.postId as string | undefined;
  const commentId = req.query.commentId as string | undefined;
  const authorName = req.query.authorName as string | undefined;
  const requesterId = req.user?.id;
  const cursor = req.query.cursor as string | undefined;
  const orderByScore = req.query.orderByScore as string | undefined;
  try {
    const comments = await commentService.getCommentsWithQueries({
      postId,
      commentId,
      requesterId,
      authorName,
      cursor,
      orderByScore,
    });
    res.status(200).json(reformatters.reformatComments(comments));
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  const commentId = req.params["commentId"];
  const user = req.user!;

  try {
    const comment = await commentService.getCommentsWithQueries({ commentId });
    const postId = comment[0].postId as string | undefined;
    const post = await postRepository.getPostsWithQueries({ postId });
    var community = undefined;
    var userCommunityRole = null;
    if (post[0].communityName) {
      community = await communityService.getCommunityByName(post[0].communityName);
      userCommunityRole = await communityService.getUserCommunityRole(user.id, community.id);
    }

    await commentService.deleteComment(commentId, comment, user, userCommunityRole);

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};

const voteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.user!;
    const { commentId, state }: z.infer<typeof voteCommentBodyValidator> = {
      commentId: req.body.commentId,
      state: req.body.state,
    };
    const requesterId = id;
    const queries = { commentId, requesterId };
    const comment = await commentService.getCommentsWithQueries(queries);
    console.log(comment);
    await commentService.overrideVoteState(id, comment[0], state);
    res.status(200).json({ message: "Vote state updated" });
  } catch (err) {
    next(err);
  }
};

const editTextPostContent = async (req: Request, res: Response, next: NextFunction) => {
  const commentId = req.params["commentId"];
  const content = req.body.content;
  const user = req.user!;

  try {
    const comment = await commentService.getCommentById(commentId);
    await commentService.editTextCommentContent(comment, content, user);

    res.status(200).json({ message: "Comment content updated" });
  } catch (err) {
    next(err);
  }
};
export const commentController = {
  createComment,
  getCommentsWithQueries,
  deleteComment,
  voteComment,
  editTextPostContent,
};
