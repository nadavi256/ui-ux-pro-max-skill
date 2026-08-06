import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncPlusPartyEvents } from "@/lib/plusparty-sync";

// Protected sync endpoint for pulling events from the user's other
// (Lovable/Supabase) events site into EventHub. Upserts by externalId, so
// it's safe to call repeatedly — each call re-applies the snapshot embedded
// in src/lib/plusparty-sync.ts. See the "PlusParty sync" Routine for how
// that snapshot gets refreshed and this endpoint re-triggered on a schedule.
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

  const result = await syncPlusPartyEvents(prisma);
  return NextResponse.json({ status: "ok", ...result });
}
