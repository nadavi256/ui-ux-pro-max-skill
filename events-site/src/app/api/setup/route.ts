import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedDatabase } from "@/lib/seed-database";

// One-time bootstrap endpoint: Vercel's build step only runs `prisma db push`
// (schema sync), not the seed script, and a serverless deploy has no shell
// access to run `npm run db:seed` manually. Visiting this URL once with the
// right secret creates the initial Super Admin + sample categories/events.
// Safe to call more than once — seedDatabase() only upserts.
function secretMatches(provided: string, expected: string) {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret") ?? "";
  const expected = process.env.AUTH_SECRET;

  if (!expected || !secretMatches(secret, expected)) {
    return NextResponse.json({ error: "Invalid or missing secret." }, { status: 403 });
  }

  const result = await seedDatabase(prisma);
  return NextResponse.json({ status: "ok", ...result });
}
