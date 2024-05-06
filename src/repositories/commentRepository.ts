import { PostType, Prisma, PrismaClient, VoteState } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

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
      postId: queries.postId,
      parentId: null,
      deleted: false,
    },
    include: {
      children: true,
    },
  });
  await getNestedCommentsRecursively(rootComments);
  return rootComments;
};

//Add-on function
async function getNestedCommentsRecursively(comments: IComment[]) {
  for (const comment of comments) {
    // Tìm các comment con của comment hiện tại
    const nestedComments = await prisma.comment.findMany({
      where: {
        parentId: comment.id,
        deleted: false,
      },
      include: {
        children: true,
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
