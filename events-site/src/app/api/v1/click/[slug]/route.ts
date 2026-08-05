import { prisma } from "@/lib/prisma";
import { corsPreflight, jsonResponse } from "@/lib/api-response";

// Used by native app clients: logs the click server-side and returns the
// affiliate URL so the app can open it in an in-app/external browser.
// The web frontend uses the simpler /out/[slug] redirect route instead.
export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const event = await prisma.event.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: { id: true, affiliateUrl: true },
  });

  if (!event) {
    return jsonResponse({ error: "Event not found" }, { status: 404 });
  }

  await prisma.clickLog.create({
    data: {
      eventId: event.id,
      referer: request.headers.get("referer"),
      userAgent: request.headers.get("user-agent"),
    },
  });

  return jsonResponse({ affiliateUrl: event.affiliateUrl });
}

export function OPTIONS() {
  return corsPreflight();
}
