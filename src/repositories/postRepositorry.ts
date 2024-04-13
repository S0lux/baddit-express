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

const getPostsInCommunity = async (communityName: string, username?: string, cursor?: string) => {
  if (username) {
    return await prisma.post.findMany({
      where: { communityName, deleted: false },
      take: 10,
      skip: 1,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        Vote: {
          where: { username },
          select: {
            username: false,
            state: true,
            postId: false,
          },
        },
      },
    });
  }

  return await prisma.post.findMany({
    where: { communityName },
    take: 10,
    skip: 1,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
  });
};

const getPostById = async (postId: string, username?: string) => {
  if (username) {
    return await prisma.post.findFirst({
      where: { id: postId },
      include: {
        Vote: {
          where: { username },
          select: {
            username: false,
            state: true,
            postId: false,
          },
        },
      },
    });
  }

  return await prisma.post.findFirst({
    where: { id: postId },
    orderBy: { createdAt: "desc" },
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
  getPostsInCommunity,
  getPostById,
  createVoteState,
  updateVoteState,
  deleteVoteState,
  findUserVoteState,
  updatePostScore,
  deletePost,
  deleteAllPostsInCommunity,
  editTextPostContent,
};
