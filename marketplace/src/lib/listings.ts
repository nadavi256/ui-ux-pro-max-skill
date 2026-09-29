import type { Condition, Prisma } from "@/generated/prisma/client";
import { DEFAULT_CATEGORIES } from "@/lib/categories-data";
import { CONDITIONS, PAGE_SIZE, SORT_OPTIONS, type SortKey } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

// Fields needed to render a ListingCard. Image bytes are never selected
// here — cards load them through /api/images/[id].
export const listingCardSelect = {
  id: true,
  title: true,
  price: true,
  city: true,
  condition: true,
  status: true,
  createdAt: true,
  images: { select: { id: true, url: true }, orderBy: { order: "asc" }, take: 1 },
} satisfies Prisma.ListingSelect;

export type ListingCardData = Prisma.ListingGetPayload<{ select: typeof listingCardSelect }>;

export interface SearchParams {
  q?: string;
  category?: string;
  city?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
}

function toInt(value: string | undefined) {
  if (!value) return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export async function searchListings(params: SearchParams) {
  const minPrice = toInt(params.minPrice);
  const maxPrice = toInt(params.maxPrice);
  const page = Math.max(1, toInt(params.page) ?? 1);
  const sort: SortKey = params.sort && params.sort in SORT_OPTIONS ? (params.sort as SortKey) : "new";
  const q = params.q?.trim();

  const where: Prisma.ListingWhereInput = {
    status: "ACTIVE",
    ...(q && {
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    }),
    ...(params.category && { category: { slug: params.category } }),
    ...(params.city && { city: params.city }),
    ...(params.condition &&
      CONDITIONS.includes(params.condition as Condition) && { condition: params.condition as Condition }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: { gte: minPrice, lte: maxPrice },
    }),
  };

  const orderBy: Prisma.ListingOrderByWithRelationInput =
    sort === "price-asc" ? { price: "asc" } : sort === "price-desc" ? { price: "desc" } : { createdAt: "desc" };

  const [items, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      select: listingCardSelect,
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.listing.count({ where }),
  ]);

  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export function getLatestListings(take = 12) {
  return prisma.listing.findMany({
    where: { status: "ACTIVE" },
    orderBy: { createdAt: "desc" },
    select: listingCardSelect,
    take,
  });
}

export function getFreeListings(take = 6) {
  return prisma.listing.findMany({
    where: { status: "ACTIVE", price: 0 },
    orderBy: { createdAt: "desc" },
    select: listingCardSelect,
    take,
  });
}

export async function getCategories() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });
  if (categories.length > 0) return categories;

  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((c, order) => ({ ...c, order })),
    skipDuplicates: true,
  });
  return prisma.category.findMany({ orderBy: { order: "asc" } });
}

export function getListing(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      category: true,
      images: { select: { id: true, url: true }, orderBy: { order: "asc" } },
      seller: { select: { id: true, name: true, phone: true, city: true, createdAt: true } },
    },
  });
}

export function getSimilarListings(listingId: string, categoryId: string, take = 4) {
  return prisma.listing.findMany({
    where: { status: "ACTIVE", categoryId, id: { not: listingId } },
    orderBy: { createdAt: "desc" },
    select: listingCardSelect,
    take,
  });
}

export async function getFavoriteIds(userId: string | undefined) {
  if (!userId) return new Set<string>();
  const favorites = await prisma.favorite.findMany({ where: { userId }, select: { listingId: true } });
  return new Set(favorites.map((f) => f.listingId));
}

export function countUnreadMessages(userId: string) {
  return prisma.message.count({
    where: {
      readAt: null,
      senderId: { not: userId },
      conversation: { OR: [{ buyerId: userId }, { listing: { sellerId: userId } }] },
    },
  });
}
