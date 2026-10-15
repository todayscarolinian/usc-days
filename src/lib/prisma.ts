import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./prisma/generated/client";
import { POSTGRES_POOL_MAX } from "@/src/constants/database";

function createPrismaClient() {
  const max = Number(POSTGRES_POOL_MAX);

  if (!Number.isSafeInteger(max) || max < 1) {
    throw new Error("POSTGRES_POOL_MAX must be a positive integer");
  }

  const adapter = new PrismaPg({
    connectionString: process.env.POSTGRES_DB_URL,
    max,
  });

  return new PrismaClient({ adapter });
}

// get globalThis connection
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

//check if conneciton exists, if not create new
const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
