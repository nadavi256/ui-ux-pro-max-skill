import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [listings, categories] = await Promise.all([
    prisma.listing.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    }),
    prisma.category.findMany({ select: { slug: true } }),
  ]);

  return [
    { url: siteConfig.url, changeFrequency: "hourly", priority: 1 },
    { url: `${siteConfig.url}/search`, changeFrequency: "hourly" },
    ...categories.map((c) => ({ url: `${siteConfig.url}/search?category=${c.slug}`, changeFrequency: "daily" as const })),
    ...listings.map((l) => ({ url: `${siteConfig.url}/listing/${l.id}`, lastModified: l.updatedAt })),
  ];
}
