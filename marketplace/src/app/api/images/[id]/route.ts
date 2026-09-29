import { prisma } from "@/lib/prisma";

// Serves uploaded listing photos stored in Postgres. Image ids are
// immutable (edits create new rows), so responses can be cached forever.
export async function GET(_request: Request, ctx: RouteContext<"/api/images/[id]">) {
  const { id } = await ctx.params;
  const image = await prisma.listingImage.findUnique({ where: { id }, select: { data: true, mime: true, url: true } });

  if (!image) return new Response("Not found", { status: 404 });
  if (image.url) return Response.redirect(image.url, 302);
  if (!image.data) return new Response("Not found", { status: 404 });

  return new Response(image.data, {
    headers: {
      "Content-Type": image.mime ?? "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
