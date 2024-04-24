import { PostType, Prisma, PrismaClient, VoteState } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

const createPost = async (data: {
  type: PostType;
  title: string;
  content: string;
  authorId: string;
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
          userId: false,
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

const overrideVoteState = async (
  state: VoteState,
  userId: string,
  postId: string,
  tx?: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) => {
  const db = tx || prisma;

  return db.postVote.upsert({
    where: { userId_postId: { postId, userId } },
    update: { state },
    create: { state, userId, postId },
  });
};

const deleteVoteState = async (
  userId: string,
  postId: string,
  tx?: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) => {
  const db = tx || prisma;
  return await db.postVote.delete({
    where: { userId_postId: { postId, userId } },
  });
};

const findUserVoteState = async (userId: string, postId: string) => {
  return await prisma.postVote.findUnique({
    where: { userId_postId: { postId, userId } },
  });
};

const updatePostScoreBy = async (
  postId: string,
  value: number,
  tx?: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) => {
  const db = tx || prisma;
  return await db.post.update({
    where: { id: postId },
    data: {
      score: {
        increment: value,
      },
    },
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
  getPostsWithQueries,
  deleteVoteState,
  findUserVoteState,
  updatePostScoreBy,
  overrideVoteState,
  deletePost,
  deleteAllPostsInCommunity,
  editTextPostContent,
};
