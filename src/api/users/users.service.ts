import { PrismaClient } from "@prisma/client";
import { RegisterBodyType } from "../auth/auth.schema";

const userClient = new PrismaClient().user;
const resetClient = new PrismaClient().passwordReset;

export const findUserByUsername = async (username: string) => {
  return await userClient.findUnique({
    where: {
      username,
    },
  });
};

export const isRegistered = async ({
  username,
  email,
}: {
  username: string;
  email: string;
}): Promise<boolean> => {
  const user = await userClient.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  return user !== null;
};

export const findUserByEmail = async (email: string) => {
  return await userClient.findUnique({
    where: {
      email,
    },
  });
};

export const registerUser = async (user: RegisterBodyType) => {
  return await userClient.create({
    data: {
      email: user.email,
      password: user.password,
      username: user.username,
    },
  });
};

export const createPasswordResetToken = async ({
  userId,
  token,
  expiresAt,
}: {
  userId: number;
  token: string;
  expiresAt: Date;
}) => {
  return await resetClient.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });
};

export const findResetPassword = async (token: string) => {
  return await resetClient.findUnique({
    where: { token },
    include: { user: true },
  });
};

export const updateResetPassword = async (
  userId: number,
  hashedPassword: string,
) => {
  return await userClient.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
};

export const deletePasswordToken = async (tokenId: string) => {
  return await resetClient.deleteMany({
    where: { id: tokenId },
  });
};
