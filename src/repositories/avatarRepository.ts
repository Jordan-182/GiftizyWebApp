import { prisma } from "@/lib/prisma";

export const avatarRepository = {
  findAll: () => prisma.avatar.findMany(),
};
