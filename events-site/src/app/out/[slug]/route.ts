import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Affiliate click-tracking redirect. Every "buy tickets" / "view event"
// button on the public site points here instead of directly at the
// external partner URL, so every click is logged before the 302 redirect.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const event = await prisma.event.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { id: true, affiliateUrl: true },
  });

  if (!event) {
    return NextResponse.redirect(new URL("/events", request.url));
  }

  await prisma.clickLog.create({
    data: {
      eventId: event.id,
      referer: request.headers.get("referer"),
      userAgent: request.headers.get("user-agent"),
    },
  });

  return NextResponse.redirect(event.affiliateUrl, { status: 302 });
}
