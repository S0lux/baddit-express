import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createUser = async (data: { username: string; hashedPassword: string; email: string }) => {
  return await prisma.user.create({ data });
};

const getUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({ where: { username } });
};

const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({ where: { email } });
};

const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
    include: { emailTokens: true },
  });
};

const updateAvatar = async (id: string, avatar: string) => {
  return await prisma.user.update({
    where: { id },
    data: { avatarUrl: avatar },
  });
};

const getEmailTokens = async (userId: string) => {
  return await prisma.emailToken.findMany({
    where: { userId },
  });
};

const updateEmailVerified = async (id: string) => {
  return await prisma.user.update({
    where: { id },
    data: { emailVerified: true },
  });
};

const addEmailToken = async (userId: string, token: string, expireAt: Date) => {
  return await prisma.emailToken.create({
    data: { token, expireAt, userId },
  });
};

const cleanUpTokens = async () => {
  return await prisma.emailToken.deleteMany({
    where: { expireAt: { lte: new Date() } },
  });
};

export const userRepository = {
  createUser,
  getUserByUsername,
  getUserById,
  updateAvatar,
  cleanUpTokens,
  addEmailToken,
  getEmailTokens,
  updateEmailVerified,
};
