import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createUser = async (data: {
  username: string;
  hashedPassword: string;
  email: string;
  avatar?: string;
}) => {
  return await prisma.user.create({ data });
};

const getUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({ where: { username } });
};

const getUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const authRepository = {
  createUser,
  getUserByUsername,
  getUserById,
};
