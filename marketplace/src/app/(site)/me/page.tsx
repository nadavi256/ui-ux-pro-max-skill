import { Eye, Heart, Package, Plus, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import type { ListingStatus } from "@/generated/prisma/client";
import { formatPrice, imageSrc, timeAgo } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata = { title: "המודעות שלי", robots: { index: false } };

const STATUS_BADGE: Record<ListingStatus, { label: string; className: string }> = {
  ACTIVE: { label: "פעילה", className: "bg-cta/10 text-cta" },
  SOLD: { label: "נמכר", className: "bg-muted text-muted-foreground" },
  HIDDEN: { label: "מוסתרת", className: "bg-warning/10 text-warning" },
};

export default async function MyListingsPage(props: PageProps<"/me">) {
  const user = await requireUser("/me");
  const { deleted } = await props.searchParams;
  const listings = await prisma.listing.findMany({
    where: { sellerId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      price: true,
      status: true,
      views: true,
      createdAt: true,
      images: { select: { id: true, url: true }, orderBy: { order: "asc" }, take: 1 },
      _count: { select: { favorites: true } },
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">שלום, {user.name}</h1>
          <p className="text-muted-foreground">המודעות שלי ({listings.length})</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/me/profile"
            className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold transition-colors duration-200 hover:bg-muted"
          >
            <Settings className="size-4" aria-hidden />
            פרטים אישיים
          </Link>
          <Link
            href="/post"
            className="flex h-11 items-center gap-2 rounded-xl bg-cta px-4 text-sm font-semibold text-cta-foreground transition-colors duration-200 hover:bg-cta-hover"
          >
            <Plus className="size-4" aria-hidden />
            מודעה חדשה
          </Link>
        </div>
      </div>

      {deleted && (
        <p role="status" className="mb-4 rounded-xl bg-muted px-4 py-3 text-sm">
          המודעה נמחקה.
        </p>
      )}

      {listings.length === 0 ? (
        <EmptyState
          icon={Package}
          title="עוד לא פרסמתם מודעות"
          text="יש לכם משהו שכבר לא בשימוש? פרסמו אותו בחינם."
          action={{ href: "/post", label: "פרסום מודעה" }}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {listings.map((l) => {
            const badge = STATUS_BADGE[l.status];
            return (
              <li key={l.id}>
                <Link
                  href={`/listing/${l.id}`}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-3 transition-colors duration-200 hover:bg-muted/50"
                >
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted sm:size-24">
                    {l.images[0] && (
                      <Image src={imageSrc(l.images[0])} alt="" fill sizes="96px" className="object-cover" />
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="truncate font-semibold">{l.title}</h2>
                      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="font-bold text-primary">{formatPrice(l.price)}</p>
                    <p className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{timeAgo(l.createdAt)}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="size-3.5" aria-hidden />
                        {l.views} צפיות
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="size-3.5" aria-hidden />
                        {l._count.favorites} שמירות
                      </span>
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
