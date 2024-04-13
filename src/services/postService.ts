import { PostType, VoteState } from "@prisma/client";
import { postRepository } from "../repositories/postRepositorry";
import { HttpException } from "../exception/httpError";
import { APP_ERROR_CODE, HttpStatusCode } from "../constants/constant";

class PostService {
  async createPost(data: {
    type: PostType;
    title: string;
    content: string;
    authorName: string;
    communityName: string;
    mediaUrls?: string[];
  }) {
    try {
      // Create post
      // Will cause error when database operation fails
      await postRepository.createPost(data);
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
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }

  async overrideVoteState(username: string, postId: string, state?: VoteState) {
    try {
      if (state) {
        const hasVoted = await postRepository.findUserVoteState(username, postId);

        if (!hasVoted) {
          await postRepository.createVoteState(username, postId, state);
        } else {
          await postRepository.updateVoteState(username, postId, state);
        }
      }

      if (!state) {
        const hasVoted = await postRepository.findUserVoteState(username, postId);

        if (hasVoted) {
          await postRepository.deleteVoteState(username, postId);
        }
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }

  async updatePostScore(postId: string, score: number) {
    try {
      await postRepository.updatePostScore(postId, score);
    } catch (err) {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }

  async findUserVoteState(username: string, postId: string) {
    return await postRepository.findUserVoteState(username, postId);
  }

  async deletePost(postId: string) {
    try {
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

  async editTextPostContent(postId: string, content: string) {
    try {
      await postRepository.editTextPostContent(postId, content);
    } catch (err) {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }
}

export default new PostService();
