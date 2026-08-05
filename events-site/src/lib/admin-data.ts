import "server-only";
import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [totalEvents, publishedEvents, draftEvents, totalClicks, totalCategories, totalUsers] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { status: "PUBLISHED" } }),
    prisma.event.count({ where: { status: "DRAFT" } }),
    prisma.clickLog.count(),
    prisma.category.count(),
    prisma.user.count(),
  ]);

  const topEvents = await prisma.event.findMany({
    orderBy: { clicks: { _count: "desc" } },
    take: 5,
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      _count: { select: { clicks: true } },
    },
  });

  return { totalEvents, publishedEvents, draftEvents, totalClicks, totalCategories, totalUsers, topEvents };
}

export async function getAllEventsForAdmin() {
  return prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, _count: { select: { clicks: true } } },
  });
}

export async function getEventForEdit(id: string) {
  return prisma.event.findUnique({ where: { id } });
}

export async function getClickTimeline(days = 14) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const clicks = await prisma.clickLog.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const click of clicks) {
    const key = click.createdAt.toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}
