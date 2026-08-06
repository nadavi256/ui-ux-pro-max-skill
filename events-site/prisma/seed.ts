import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { seedDatabase } from "../src/lib/seed-database";

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL ?? process.env.POSTGRES_URL;
if (!url) throw new Error("DATABASE_URL is not set.");
const adapter = new PrismaPg(url);
const prisma = new PrismaClient({ adapter });

seedDatabase(prisma)
  .then(({ adminEmail, categoriesCount, eventsCount }) => {
    console.log(`Super admin ready: ${adminEmail} (password from SEED_ADMIN_PASSWORD)`);
    console.log(`Seeded ${categoriesCount} categories and ${eventsCount} events.`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
