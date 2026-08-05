import { getCategories } from "@/lib/events";
import { corsPreflight, jsonResponse } from "@/lib/api-response";

export async function GET() {
  const categories = await getCategories();
  return jsonResponse({ categories });
}

export function OPTIONS() {
  return corsPreflight();
}
