import "server-only";
import { prisma } from "@/lib/prisma";

export interface EventFilters {
  city?: string;
  categorySlug?: string;
  query?: string;
}

export function publicEventSelect() {
  return {
    id: true,
    slug: true,
    title: true,
    description: true,
    coverImageUrl: true,
    startDate: true,
    endDate: true,
    venueName: true,
    city: true,
    address: true,
    priceLabel: true,
    affiliateUrl: true,
    featured: true,
    metaTitle: true,
    metaDescription: true,
    category: { select: { id: true, name: true, slug: true } },
  } as const;
}

export async function getPublishedEvents(filters: EventFilters = {}) {
  return prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      ...(filters.city ? { city: filters.city } : {}),
      ...(filters.categorySlug ? { category: { slug: filters.categorySlug } } : {}),
      ...(filters.query
        ? {
            OR: [
              { title: { contains: filters.query } },
              { description: { contains: filters.query } },
              { city: { contains: filters.query } },
              { venueName: { contains: filters.query } },
            ],
          }
        : {}),
    },
    orderBy: { startDate: "asc" },
    select: publicEventSelect(),
  });
}

export async function getFeaturedEvents(take = 4) {
  return prisma.event.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: { startDate: "asc" },
    take,
    select: publicEventSelect(),
  });
}

export async function getEventBySlug(slug: string) {
  return prisma.event.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: publicEventSelect(),
  });
}

export async function getAllCities() {
  const rows = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });
  return rows.map((r) => r.city);
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getPastEvents(take = 6) {
  return prisma.event.findMany({
    where: { status: "PUBLISHED", startDate: { lt: new Date() } },
    orderBy: { startDate: "desc" },
    take,
    select: publicEventSelect(),
  });
}

export async function getAllPublishedSlugs() {
  const rows = await prisma.event.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });
  return rows;
}
