import { PostType, Prisma, PrismaClient, VoteState } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

const prisma = new PrismaClient();

type Comment = Prisma.CommentGetPayload<{
  include: {
    children: true;
    CommentVote: { select: { state: true; userId: false; commentId: false } };
  };
}>;

interface IComment {
  id: string;
  content: string;
  authorId: string;
  parentId: string | null;
  postId: string | null;
  deleted: boolean;
  updatedAt: Date;
  createdAt: Date;
  children?: IComment[];
}

const createComment = async (data: {
  content: string;
  authorId: string;
  parentId?: string;
  postId?: string;
}) => {
  return await prisma.comment.create({ data });
};

const getCommentsWithQueries = async (queries: {
  requesterId?: string;
  authorId?: string;
  commentId?: string;
  postId?: string;
  cursor?: string;
}) => {
  // if having commentId here , we knowing that the main get with queries function is only find one specific comment not all comments of post
  const rootComments = await prisma.comment.findMany({
    where: {
      id: queries.commentId,
      parentId: queries.commentId ? undefined : null,
      deleted: false,
      postId: queries.postId,
      authorId: queries.authorId,
    },
    take: 10,
    skip: queries.cursor ? 1 : 0,
    cursor: queries.cursor ? { id: queries.cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      children: true,
      CommentVote: {
        where: queries.requesterId
          ? { user: { id: queries.requesterId } }
          : { user: { id: "dummy-id" } },
        select: {
          state: true,
          userId: false,
          commentId: false,
        },
      },
      author: {
        select: {
          avatarUrl: true,
          username: true,
        },
      },
    },
  });

  await getNestedCommentsRecursively(rootComments, queries.requesterId);
  return rootComments;
};

//Add-on function
async function getNestedCommentsRecursively(
  comments: Comment[],
  requesterId?: string,
  id?: string
) {
  if (id !== undefined) return;
  for (const comment of comments) {
    // Tìm các comment con của comment hiện tại
    const nestedComments = await prisma.comment.findMany({
      where: {
        parentId: comment.id,
        deleted: false,
      },
      include: {
        children: true,
        CommentVote: {
          where: requesterId ? { user: { id: requesterId } } : { user: { id: "dummy-id" } },
          select: {
            state: true,
            userId: false,
            commentId: false,
          },
        },
        author: {
          select: {
            avatarUrl: true,
            username: true,
          },
        },
      },
    });

    // Nếu có các comment con, gán chúng vào thuộc tính children và tiếp tục đệ quy
    if (nestedComments.length > 0) {
      comment.children = nestedComments;
      await getNestedCommentsRecursively(nestedComments, requesterId);
    }
  }
}

const deleteComment = async (commentId: string) => {
  return await prisma.comment.update({
    where: { id: commentId },
    data: {
      deleted: true,
      updatedAt: new Date(),
    },
  });
};

const findUserVoteState = async (userId: string, commentId: string) => {
  return await prisma.commentVote.findUnique({
    where: { userId_commentId: { commentId, userId } },
  });
};

const overrideVoteState = async (
  state: VoteState,
  userId: string,
  commentId: string,
  tx?: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) => {
  const db = tx || prisma;

  return db.commentVote.upsert({
    where: { userId_commentId: { commentId, userId } },
    update: { state },
    create: { state, userId, commentId },
  });
};

const deleteVoteState = async (
  userId: string,
  commentId: string,
  tx?: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) => {
  const db = tx || prisma;
  return await db.commentVote.delete({
    where: { userId_commentId: { commentId, userId } },
  });
};

const updateCommentScoreBy = async (
  commentId: string,
  value: number,
  tx?: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
  >
) => {
  const db = tx || prisma;
  return await db.comment.update({
    where: { id: commentId },
    data: {
      score: {
        increment: value,
      },
    },
  });
};

const editTextCommentContent = async (commentId: string, content: string) => {
  return await prisma.comment.update({
    where: { id: commentId },
    data: {
      content: content,
      updatedAt: new Date(),
    },
  });
};

export const commentRepository = {
  createComment,
  getCommentsWithQueries,
  deleteComment,
  editTextCommentContent,
  updateCommentScoreBy,
  findUserVoteState,
  deleteVoteState,
  overrideVoteState,
};
