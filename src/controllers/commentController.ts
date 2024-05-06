import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { commentBodyValidator } from "../validators/schemas/commentBody";
import commentService from "../services/commentService";

const createComment = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!.id;
  const { content, postId, parentId }: z.infer<typeof commentBodyValidator> = req.body;
  try {
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
  const authorId = req.query.authorId as string | undefined;
  const requesterId = req.user?.id;
  const cursor = req.query.cursor as string | undefined;
  try {
    const comments = await commentService.getCommentsWithQueries({
      postId,
      requesterId,
      authorId,
      cursor,
    });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};

export const commentController = {
  createComment,
  getCommentsWithQueries,
};
