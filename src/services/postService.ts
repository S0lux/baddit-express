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

  async getPostsInCommunity(communityName: string, username?: string, cursor?: string) {
    try {
      // Get posts in community
      // Will cause error when database operation fails
      const posts = await postRepository.getPostsInCommunity(communityName, username, cursor);

      // const filteredPosts = posts.map((post) => {
      //   if (post.deleted) {
      //     return {
      //       ...post,
      //       content: "[deleted]",
      //       mediaUrls: [],
      //       title: "[deleted]",
      //       authorName: "[deleted]",
      //     };
      //   } else return post;
      // });

      return posts;
    } catch (err) {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }

  async getPostById(postId: string, username?: string) {
    const post = await postRepository.getPostById(postId, username);

    if (!post || post.deleted) {
      throw new HttpException(HttpStatusCode.NOT_FOUND, APP_ERROR_CODE.postNotFound);
    }

    // if (post.deleted) {
    //   return {
    //     ...post,
    //     content: "[deleted]",
    //     mediaUrls: [],
    //     title: "[deleted]",
    //     authorName: "[deleted]",
    //   };
    // }

    return post;
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

  async editTextPostContent(postId: string, content: string) {
    try {
      await postRepository.editTextPostContent(postId, content);
    } catch (err) {
      throw new HttpException(HttpStatusCode.INTERNAL_SERVER_ERROR, APP_ERROR_CODE.serverError);
    }
  }
}

export default new PostService();
