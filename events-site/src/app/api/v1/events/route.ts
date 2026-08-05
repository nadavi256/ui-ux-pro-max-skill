import { getPublishedEvents } from "@/lib/events";
import { corsPreflight, jsonResponse } from "@/lib/api-response";

// Public read-only events feed — the same data source that powers the
// website, exposed as JSON so a future React Native / Flutter app (or any
// other client) can list events without re-implementing the query logic.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const events = await getPublishedEvents({
    city: searchParams.get("city") ?? undefined,
    categorySlug: searchParams.get("category") ?? undefined,
    query: searchParams.get("q") ?? undefined,
  });

  return jsonResponse({ events });
}

export function OPTIONS() {
  return corsPreflight();
}
