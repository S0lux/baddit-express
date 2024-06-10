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
  authorName?: string;
  commentId?: string;
  postId?: string;
  cursor?: string;
  orderByScore?: string;
}) => {
  // if having commentId here , we knowing that the main get with queries function is only find one specific comment not all comments of post
  const rootComments = await prisma.comment.findMany({
    where: {
      id: queries.commentId,
      parentId: queries.commentId || queries.authorName ? undefined : null,
      postId: queries.postId,
      author: { username: queries.authorName },
    },
    take: 10,
    skip: queries.cursor ? 1 : 0,
    cursor: queries.cursor ? { id: queries.cursor } : undefined,
    orderBy: queries.orderByScore ? { score: "desc" } : { createdAt: "desc" },
    include: {
      children: queries.commentId || queries.authorName ? false : true,
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
      post: {
        include: {
          community: true,
        },
      },
    },
  });
  if (queries.authorName === undefined && queries.commentId === undefined) {
    await getNestedCommentsRecursively(rootComments, queries.requesterId);
  }
  const editedComments = rootComments.map((comment) => {
    if (comment.deleted == false) return comment;

    // Redact comment content and author if deleted
    return {
      ...comment,
      content: "[deleted]",
      author: {
        avatarUrl:
          "https://res.cloudinary.com/drzvajzd4/image/upload/f_auto,q_auto/v1/defaults/default_avatar_anonymous",
        username: "[deleted]",
      },
      authorId: "[deleted]",
    };
  });

  return editedComments;
};

//Add-on function
async function getNestedCommentsRecursively(comments: Comment[], requesterId?: string) {
  for (const comment of comments) {
    // Tìm các comment con của comment hiện tại
    const nestedComments = await prisma.comment.findMany({
      where: {
        parentId: comment.id,
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
        post: {
          select: {
            author: true,
            community: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
              },
            },
          },
        },
      },
    });

    // Nếu có các comment con, gán chúng vào thuộc tính children và tiếp tục đệ quy
    if (nestedComments.length > 0) {
      const editedComments = nestedComments.map((comment) => {
        if (comment.deleted == false) return comment;

        // Redact comment content and author if deleted
        return {
          ...comment,
          content: "[deleted]",
          author: {
            avatarUrl:
              "https://res.cloudinary.com/drzvajzd4/image/upload/f_auto,q_auto/v1/defaults/default_avatar_anonymous",
            username: "[deleted]",
          },
          authorId: "[deleted]",
        };
      });

      comment.children = editedComments;
      await getNestedCommentsRecursively(editedComments, requesterId);
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

const deleteAllComment = async (postId: string) => {
  return await prisma.comment.updateMany({
    where: {
      postId: postId,
    },
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
  deleteAllComment,
  editTextCommentContent,
  updateCommentScoreBy,
  findUserVoteState,
  deleteVoteState,
  overrideVoteState,
};
