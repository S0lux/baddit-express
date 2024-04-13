import { PostType, PrismaClient, VoteState } from "@prisma/client";

const prisma = new PrismaClient();

const createPost = async (data: {
  type: PostType;
  title: string;
  content: string;
  authorName: string;
  communityName: string;
  mediaUrls?: string[];
}) => {
  return await prisma.post.create({ data });
};

const getPostsWithQueries = async (queries: {
  requesterId?: string;
  authorId?: string;
  postId?: string;
  communityId?: string;
  cursor?: string;
}) => {
  return await prisma.post.findMany({
    where: {
      author: { id: queries.authorId },
      id: queries.postId,
      community: { id: queries.communityId },
      deleted: false,
    },
    take: 10,
    skip: queries.cursor ? 1 : 0,
    cursor: queries.cursor ? { id: queries.cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      vote: {
        where: queries.requesterId
          ? { user: { id: queries.requesterId } }
          : { user: { id: "dummy-id" } },
        select: {
          state: true,
          username: false,
          postId: false,
        },
      },
      author: {
        select: {
          avatarUrl: true,
        },
      },
    },
  });
};

const createVoteState = async (username: string, postId: string, state: VoteState) => {
  return await prisma.vote.create({
    data: {
      username,
      postId,
      state,
    },
  });
};

const updateVoteState = async (username: string, postId: string, state: VoteState) => {
  return await prisma.vote.update({
    where: { username_postId: { postId, username } },
    data: { state },
  });
};

const deleteVoteState = async (username: string, postId: string) => {
  return await prisma.vote.delete({
    where: { username_postId: { postId, username } },
  });
};

const findUserVoteState = async (username: string, postId: string) => {
  return await prisma.vote.findUnique({
    where: { username_postId: { postId, username } },
  });
};

const updatePostScore = async (postId: string, score: number) => {
  return await prisma.post.update({
    where: { id: postId },
    data: { score },
  });
};

const deletePost = async (postId: string) => {
  return await prisma.post.update({
    where: { id: postId },
    data: {
      deleted: true,
      updatedAt: new Date(),
    },
  });
};

const deleteAllPostsInCommunity = async (communityName: string) => {
  return await prisma.post.updateMany({
    where: { communityName: communityName },
    data: { deleted: true, updatedAt: new Date() },
  });
};

const editTextPostContent = async (postId: string, content: string) => {
  return await prisma.post.update({
    where: { id: postId },
    data: { content, updatedAt: new Date() },
  });
};

export const postRepository = {
  createPost,
  createVoteState,
  getPostsWithQueries,
  updateVoteState,
  deleteVoteState,
  findUserVoteState,
  updatePostScore,
  deletePost,
  deleteAllPostsInCommunity,
  editTextPostContent,
};
