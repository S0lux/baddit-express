import { Prisma } from "@prisma/client";

type Posts = Prisma.PostGetPayload<{
  include: { community: true; author: true; vote: true; _count: { select: { comments: true } } };
}>;

function reformatPosts(posts: Posts[]) {
  const formattedPosts = posts.map((post) => ({
    id: post.id,
    type: post.type,
    title: post.title,
    content: post.content,
    score: post.score,
    voteState: post.vote[0]?.state || "NONE",
    commentCount: post._count.comments,
    author: {
      id: post.authorId,
      username: post.author.username,
      avatarUrl: post.author.avatarUrl,
    },
    community: {
      name: post.communityName,
      logoUrl: post.community.logoUrl,
    },
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));

  return formattedPosts;
}

export const reformatters = {
  reformatPosts,
};
