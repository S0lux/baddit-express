import { CommunityRole, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createCommunity = async (data: { name: string; description: string }) => {
  return await prisma.community.create({ data }).catch((error) => null);
};

const getCommunityByName = async (name: string) => {
  return await prisma.community.findUnique({ where: { name } });
};

const createCommunityModerator = async (communityId: string, userId: string) => {
  const data = { communityId: communityId, userId: userId, communityRole: CommunityRole.MODERATOR };
  return await prisma.user_Community.create({ data }).catch((err) => null);
};

const createCommunityMember = async (communityId: string, userId: string) => {};

export const communityRepository = {
  createCommunity,
  createCommunityModerator,
  getCommunityByName,
};
