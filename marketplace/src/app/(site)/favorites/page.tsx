import { Heart } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard, ListingGrid } from "@/components/ListingCard";
import { listingCardSelect } from "@/lib/listings";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata = { title: "מועדפים", robots: { index: false } };

export default async function FavoritesPage() {
  const user = await requireUser("/favorites");
  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id, listing: { status: { not: "HIDDEN" } } },
    orderBy: { createdAt: "desc" },
    select: { listing: { select: listingCardSelect } },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">מועדפים</h1>
      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="אין עדיין מודעות שמורות"
          text="לחצו על הלב במודעה כדי לשמור אותה כאן."
          action={{ href: "/search", label: "לחיפוש מודעות" }}
        />
      ) : (
        <ListingGrid>
          {favorites.map(({ listing }) => (
            <ListingCard key={listing.id} listing={listing} favorited />
          ))}
        </ListingGrid>
      )}
    </div>
  );
}
