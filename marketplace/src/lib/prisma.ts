import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Postgres via driver adapter (Prisma 7 requires one explicitly — no
// implicit connection from the schema file). Accepts DATABASE_URL, or
// Vercel's Postgres/Neon storage integration var names as a fallback so
// connecting that integration works without renaming anything.
function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL ?? process.env.POSTGRES_URL;

  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Add a Postgres connection string (see README.md 'Database setup').",
    );
  }

  return new PrismaClient({ adapter: new PrismaPg(url) });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
