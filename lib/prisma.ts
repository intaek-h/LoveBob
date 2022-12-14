declare global {
  var prisma: PrismaClient | undefined;
}

import { PrismaClient } from "@prisma/client";

const prisma =
  global.prisma ||
  new PrismaClient({
    log: [],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
