import type { MetadataRoute } from "next";
import { getAllPublishedSlugs, getCategories } from "@/lib/events";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, categories] = await Promise.all([getAllPublishedSlugs(), getCategories()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, changeFrequency: "daily", priority: 1 },
    { url: `${siteConfig.url}/events`, changeFrequency: "hourly", priority: 0.9 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${siteConfig.url}/categories/${category.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const eventRoutes: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${siteConfig.url}/events/${event.slug}`,
    lastModified: event.updatedAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...eventRoutes];
}
