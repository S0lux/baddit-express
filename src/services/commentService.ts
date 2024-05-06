import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";
import { Post, Comment, CommentVote, VoteState, Prisma, PrismaClient } from "@prisma/client";
import { commentRepository } from "../repositories/commentRepository";

const prisma = new PrismaClient();

class CommentService {
  async createComment(content: string, authorId: string, postId?: string, parentId?: string) {
    let commentData = {
      content,
      authorId,
      postId,
      parentId,
    };
    try {
      await commentRepository.createComment(commentData);
    } catch (errr) {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        APP_ERROR_CODE.createCommentFailed
      );
    }
  }
  async getCommentsWithQueries(queries: {
    postId?: string;
    requesterId?: string;
    authorId?: string;
    cursor?: string;
  }) {
    try {
      return await commentRepository.getCommentsWithQueries(queries);
    } catch (err) {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }
}

export default new CommentService();
