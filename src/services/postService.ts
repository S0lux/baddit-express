import {
  Community,
  Post,
  PostType,
  Prisma,
  PrismaClient,
  User_Community,
  PostVote,
  VoteState,
} from "@prisma/client";
import { postRepository } from "../repositories/postRepositorry";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";

const prisma = new PrismaClient();

class PostService {
  async createPost(
    title: string,
    content: string,
    type: PostType,
    community: Community,
    userId: string,
    mediaArray?: Express.Multer.File[]
  ) {
    // Build post data
    let postData;

    if (type === PostType.TEXT || type === PostType.LINK) {
      postData = {
        title,
        content,
        type,
        authorId: userId,
        communityName: community.name,
      };
    } else {
      // Validate media files
      if (!mediaArray || mediaArray.length === 0) {
        throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.missingMedia);
      }

      const mediaUrls = mediaArray.map((file) => file.path);

      // Build post data
      postData = {
        title,
        content: "",
        type,
        authorId: userId,
        communityName: community.name,
        mediaUrls: mediaUrls,
      };
    }

    try {
      // Create post
      // Will cause error when database operation fails
      await postRepository.createPost(postData);
    } catch (err) {
      throw new HttpException(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        APP_ERROR_CODE.createPostFailed
      );
    }
  }

  async getPostsWithQueries(queries: {
    requesterId?: string;
    authorId?: string;
    postId?: string;
    communityId?: string;
    cursor?: string;
  }) {
    try {
      // Get posts with queries
      // Will cause error when database operation fails
      return await postRepository.getPostsWithQueries(queries);
    } catch (err) {
      console.log(err);
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }

  async overrideVoteState(
    userId: string,
    post: Prisma.PostGetPayload<{
      include: { vote: { select: { state: true } }; author: { select: { avatarUrl: true } } };
    }>,
    state?: VoteState
  ) {
    try {
      // If a state is provided, update the vote state and post score of the post
      if (state) {
        // Make sure all database operations are successful or none at all
        await prisma.$transaction(async (tx) => {
          await postRepository.overrideVoteState(state, userId, post.id, tx);
          const previousState = post.vote[0]?.state;

          if (previousState === VoteState.UPVOTE && state === VoteState.DOWNVOTE) {
            await postRepository.updatePostScoreBy(post.id, -2, tx);
          } else if (previousState === VoteState.DOWNVOTE && state === VoteState.UPVOTE) {
            await postRepository.updatePostScoreBy(post.id, 2, tx);
          } else
            await postRepository.updatePostScoreBy(
              post.id,
              state === VoteState.UPVOTE ? 1 : -1,
              tx
            );
        });
      }

      // If no state is provided, delete the vote state
      if (!state) {
        const hasVoted = post.vote[0]?.state;
        // Make sure all database operations are successful or none at all
        await prisma.$transaction(async (tx) => {
          await postRepository.deleteVoteState(userId, post.id, tx);
          if (hasVoted === VoteState.UPVOTE) {
            await postRepository.updatePostScoreBy(post.id, -1, tx);
          } else {
            await postRepository.updatePostScoreBy(post.id, 1, tx);
          }
        });
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }

  async findUserVoteState(userId: string, postId: string) {
    return await postRepository.findUserVoteState(userId, postId);
  }

  async deletePost(
    postId: string,
    post: Post[],
    user: Express.User,
    userCommunityRole: User_Community | null
  ) {
    try {
      // Check if user is the author of the post
      if (
        post[0].authorId !== user.id &&
        user.role !== "ADMIN" &&
        userCommunityRole?.communityRole !== "MODERATOR"
      ) {
        throw new HttpException(HttpStatusCode.FORBIDDEN, APP_ERROR_CODE.insufficientPermissions);
      }
      await postRepository.deletePost(postId);
    } catch (err) {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }

  async deleteAllPostsInCommunity(communityName: string) {
    try {
      await postRepository.deleteAllPostsInCommunity(communityName);
    } catch (err) {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }

  async editTextPostContent(
    post: Prisma.PostGetPayload<{
      include: { vote: { select: { state: true } }; author: { select: { avatarUrl: true } } };
    }>,
    content: string,
    user: Express.User
  ) {
    if (content === "") {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, APP_ERROR_CODE.unexpectedBody);
    }

    if (post.type === PostType.MEDIA) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        APP_ERROR_CODE.mediaPostEditingUnsupported
      );
    }

    if (post.authorId !== user.id) {
      throw new HttpException(HttpStatusCode.FORBIDDEN, APP_ERROR_CODE.insufficientPermissions);
    }

    try {
      await postRepository.editTextPostContent(post.id, content);
    } catch (err) {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }
}

export default new PostService();
