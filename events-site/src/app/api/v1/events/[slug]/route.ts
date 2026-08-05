import { getEventBySlug } from "@/lib/events";
import { corsPreflight, jsonResponse } from "@/lib/api-response";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return jsonResponse({ error: "Event not found" }, { status: 404 });
  }

  return jsonResponse({ event });
}

export function OPTIONS() {
  return corsPreflight();
}
