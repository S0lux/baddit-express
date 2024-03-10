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

export const authRepository = {
  createUser,
};
