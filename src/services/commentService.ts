import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";
import { Comment, VoteState, Prisma, PrismaClient, User_Community } from "@prisma/client";
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
    commentId?: string;
    requesterId?: string;
    authorName?: string;
    cursor?: string;
    orderByScore?: string;
  }) {
    try {
      return await commentRepository.getCommentsWithQueries(queries);
    } catch (err) {
      console.log(err);
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }
  async overrideVoteState(
    userId: string,
    comment: Prisma.CommentGetPayload<{
      include: {
        CommentVote: { select: { state: true } };
        author: { select: { avatarUrl: true } };
      };
    }>,
    state?: VoteState
  ) {
    try {
      if (state) {
        await prisma.$transaction(async (tx) => {
          await commentRepository.overrideVoteState(state, userId, comment.id, tx);
          const previousState = comment.CommentVote[0]?.state;

          if (previousState === VoteState.UPVOTE && state === VoteState.DOWNVOTE) {
            await commentRepository.updateCommentScoreBy(comment.id, -2, tx);
          } else if (previousState === VoteState.DOWNVOTE && state === VoteState.UPVOTE) {
            await commentRepository.updateCommentScoreBy(comment.id, 2, tx);
          } else if (previousState === state) {
            console.log("here");
            await commentRepository.deleteVoteState(userId, comment.id, tx);
            if (state === VoteState.UPVOTE) {
              await commentRepository.updateCommentScoreBy(comment.id, -1, tx);
            } else {
              await commentRepository.updateCommentScoreBy(comment.id, 1, tx);
            }
          } else if (previousState === undefined) {
            await commentRepository.updateCommentScoreBy(
              comment.id,
              state === VoteState.UPVOTE ? 1 : -1,
              tx
            );
          }
        });
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }
  async findUserVoteState(userId: string, commentId: string) {
    return await commentRepository.findUserVoteState(userId, commentId);
  }

  async deleteComment(
    commentId: string,
    comment: Comment[],
    user: Express.User,
    userCommunityRole: User_Community | null
  ) {
    try {
      if (
        comment[0].authorId !== user.id &&
        user.role !== "ADMIN" &&
        userCommunityRole?.communityRole !== "MODERATOR"
      ) {
        throw new HttpException(HttpStatusCode.FORBIDDEN, APP_ERROR_CODE.insufficientPermissions);
      }
      await commentRepository.deleteComment(commentId);
    } catch (err) {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }
  async editTextCommentContent(
    comment: Prisma.CommentGetPayload<{
      include: {
        CommentVote: { select: { state: true } };
        author: { select: { avatarUrl: true } };
      };
    }>,
    content: string,
    user: Express.User
  ) {
    if (content === "") {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unexpectedBody);
    }

    if (comment.authorId !== user.id) {
      throw new HttpException(HttpStatusCode.FORBIDDEN, APP_ERROR_CODE.insufficientPermissions);
    }

    try {
      await commentRepository.editTextCommentContent(comment.id, content);
    } catch (err) {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }
}

export default new CommentService();
