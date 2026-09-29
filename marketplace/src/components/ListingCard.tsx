import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";
import { CONDITION_LABELS } from "@/lib/constants";
import { formatPrice, imageSrc, timeAgo } from "@/lib/format";
import type { ListingCardData } from "@/lib/listings";

export function ListingCard({
  listing,
  favorited,
  priority,
}: {
  listing: ListingCardData;
  favorited?: boolean;
  priority?: boolean;
}) {
  const cover = listing.images[0];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow duration-200 hover:shadow-lg hover:shadow-primary/5">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {cover && (
          <Image
            src={imageSrc(cover)}
            alt={listing.title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 20vw, (min-width: 768px) 30vw, 50vw"
            className="object-cover transition-opacity duration-200 group-hover:opacity-95"
          />
        )}
        {listing.price === 0 && (
          <span className="absolute top-2 right-2 rounded-full bg-cta px-2.5 py-1 text-xs font-bold text-cta-foreground">
            למסירה
          </span>
        )}
        {listing.status === "SOLD" && (
          <span className="absolute inset-0 grid place-items-center bg-foreground/50 text-lg font-bold text-white">
            נמכר
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-lg font-bold text-foreground">{formatPrice(listing.price)}</p>
        <h3 className="line-clamp-2 text-sm leading-snug font-medium text-foreground">
          <Link href={`/listing/${listing.id}`} className="after:absolute after:inset-0">
            {listing.title}
          </Link>
        </h3>
        <p className="mt-auto flex items-center gap-1 pt-1 text-xs text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{listing.city}</span>
          <span aria-hidden>·</span>
          <span className="shrink-0">{timeAgo(listing.createdAt)}</span>
        </p>
        <p className="sr-only">מצב: {CONDITION_LABELS[listing.condition]}</p>
      </div>
      <div className="absolute top-2 left-2 z-10">
        <FavoriteButton listingId={listing.id} initial={!!favorited} />
      </div>
    </article>
  );
}

export function ListingGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">{children}</div>;
}
