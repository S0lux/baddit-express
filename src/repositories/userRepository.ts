import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createUser = async (data: {
  username: string;
  hashedPassword: string;
  email: string;
}) => {
  return await prisma.user.create({ data }).catch((error) => null);
};

const getUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({ where: { username } });
};

const getUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};

const updateAvatar = async (id: string, avatar: string) => {
  return await prisma.user.update({
    where: { id },
    data: { avatarUrl: avatar },
  });
};

export const userRepository = {
  createUser,
  getUserByUsername,
  getUserById,
  updateAvatar,
};
