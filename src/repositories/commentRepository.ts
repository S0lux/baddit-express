import { PostType, Prisma, PrismaClient, VoteState } from "@prisma/client";

const prisma = new PrismaClient();

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
  postId?: string;
  cursor?: string;
}) => {
  const rootComments = await prisma.comment.findMany({
    where: {
      author: { id: queries.authorId },
      postId: queries.postId,
      parentId: null,
      deleted: false,
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
        },
      },
    },
  });
  await getNestedCommentsRecursively(rootComments, queries.requesterId);
  return rootComments;
};

//Add-on function
async function getNestedCommentsRecursively(comments: IComment[], requesterId?: string) {
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
          },
        },
      },
    });

    // Nếu có các comment con, gán chúng vào thuộc tính children và tiếp tục đệ quy
    if (nestedComments.length > 0) {
      comment.children = nestedComments;
      await getNestedCommentsRecursively(nestedComments);
    }
  }
}

export const commentRepository = {
  createComment,
  getCommentsWithQueries,
};
