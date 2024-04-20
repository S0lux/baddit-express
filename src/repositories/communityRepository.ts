import { CommunityRole, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createCommunity = async (data: { name: string; description: string; ownerId: string }) => {
  return await prisma.community.create({ data }).catch((error) => null);
};

const getCommunityByName = async (name: string) => {
  return await prisma.community.findUnique({ where: { name: name, deleted: false } });
};

const createCommunityModerator = async (
  userId: string,
  communityId: string,
  communityRole: CommunityRole = CommunityRole.MODERATOR
) => {
  const data = { userId: userId, communityId: communityId, communityRole: communityRole };
  return await prisma.user_Community.create({ data }).catch((err) => null);
};

const createCommunityMember = async (data: { communityId: string; userId: string }) => {
  return await prisma.user_Community.create({ data }).catch((err) => null);
};

const getUserCommunityRole = async (userId: string, communityId: string) => {
  return await prisma.user_Community.findFirst({
    where: { userId: userId, communityId: communityId },
  });
};

const getCommunitiesWithQueries = async (name: string, cursor?: string) => {
  return await prisma.community.findMany({
    take: 10,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    where: {
      name: {
        startsWith: name,
      },
      deleted: false,
    },
    orderBy: {
      //memberCount: "desc",
    },
  });
};

const deleteCommunity = async (communityName: string) => {
  return await prisma.community.update({
    where: { name: communityName },
    data: { deleted: true, updateAt: new Date() },
  });
};

const updateCommunityMemberCount = async (communityName: string, memberCount: number) => {
  return await prisma.community.update({
    where: { name: communityName },
    data: { memberCount: memberCount, updateAt: new Date() },
  });
};

const updateLogo = async (name: string, logo: string) => {
  return await prisma.community.update({
    where: { name: name },
    data: { logoUrl: logo },
  });
};

const updateBanner = async (name: string, banner: string) => {
  return await prisma.community.update({
    where: { name: name },
    data: { bannerUrl: banner },
  });
};

export const communityRepository = {
  createCommunity,
  createCommunityModerator,
  createCommunityMember,
  getCommunityByName,
  getCommunitiesWithQueries,
  getUserCommunityRole,
  deleteCommunity,
  updateCommunityMemberCount,
  updateLogo,
  updateBanner,
};
