import { CommunityRole, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createCommunity = async (data: { name: string; description: string; ownerId: string }) => {
  return await prisma.community.create({ data }).catch((error) => null);
};

const getCommunityByName = async (name: string) => {
  return await prisma.community.findUnique({ where: { name } });
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

export const communityRepository = {
  createCommunity,
  createCommunityModerator,
  createCommunityMember,
  getCommunityByName,
};
