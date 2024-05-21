import { Prisma } from "@prisma/client";

type Posts = Prisma.PostGetPayload<{
  include: { community: true; author: true; vote: true; _count: { select: { comments: true } } };
}>;

type UserCommunities = Prisma.User_CommunityGetPayload<{
  include: { community: true };
}>;

type Users = Prisma.UserGetPayload<{}>;

function reformatPosts(posts: Posts[]) {
  const formattedPosts = posts.map((post) => ({
    id: post.id,
    type: post.type,
    title: post.title,
    content: post.content,
    score: post.score,
    voteState: post.vote[0]?.state || null,
    commentCount: post._count.comments,
    author: {
      id: post.authorId,
      username: post.author.username,
      avatarUrl: post.author.avatarUrl,
    },
    community: {
      name: post.communityName,
      logoUrl: post.community?.logoUrl,
    },
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  }));

  return formattedPosts;
}

function reformatUserCommunities(userCommunities: UserCommunities[]) {
  const formattedUserCommunities = userCommunities.map((data) => ({
    id: data.communityId,
    name: data.community.name,
    role: data.communityRole,
    banned: data.banned,
  }));

  return formattedUserCommunities;
}

function reformatUsers(user: Users) {
  const formattedUsers = {
    id: user.id,
    username: user.username,
    avatarUrl: user.avatarUrl,
    registeredAt: user.registeredAt,
  };
  return formattedUsers;
}

export const reformatters = {
  reformatPosts,
  reformatUserCommunities,
  reformatUsers,
};
