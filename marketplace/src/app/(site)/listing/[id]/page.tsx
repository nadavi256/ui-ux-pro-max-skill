import type { Metadata } from "next";
import { CircleCheck, Clock, Eye, MapPin, ShieldCheck, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactPanel } from "@/components/ContactPanel";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ImageGallery } from "@/components/ImageGallery";
import { ListingCard, ListingGrid } from "@/components/ListingCard";
import { OwnerActions } from "@/components/OwnerActions";
import { CONDITION_LABELS } from "@/lib/constants";
import { formatPrice, imageSrc, timeAgo } from "@/lib/format";
import { getFavoriteIds, getListing, getSimilarListings } from "@/lib/listings";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata(props: PageProps<"/listing/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const listing = await getListing(id);
  if (!listing || listing.status === "HIDDEN") return {};
  const title = `${listing.title} — ${formatPrice(listing.price)} ב${listing.city}`;
  return {
    title,
    description: listing.description.slice(0, 160),
    alternates: { canonical: `/listing/${listing.id}` },
    openGraph: { title, images: listing.images[0] ? [{ url: imageSrc(listing.images[0]) }] : [] },
  };
}

export default async function ListingPage(props: PageProps<"/listing/[id]">) {
  const { id } = await props.params;
  const { posted } = await props.searchParams;
  const [listing, user] = await Promise.all([getListing(id), getCurrentUser()]);
  if (!listing) notFound();

  const isOwner = user?.id === listing.sellerId || user?.role === "ADMIN";
  if (listing.status === "HIDDEN" && !isOwner) notFound();

  if (!isOwner) {
    await prisma.listing.update({ where: { id }, data: { views: { increment: 1 } } });
  }

  const [similar, favoriteIds] = await Promise.all([
    getSimilarListings(listing.id, listing.categoryId),
    getFavoriteIds(user?.id),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: listing.images.map((img) => new URL(imageSrc(img), siteConfig.url).toString()),
    itemCondition:
      listing.condition === "NEW" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      price: listing.price,
      priceCurrency: "ILS",
      availability:
        listing.status === "ACTIVE" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {posted && (
        <p role="status" className="mb-4 flex items-center gap-2 rounded-xl bg-cta/10 px-4 py-3 font-medium text-cta">
          <CircleCheck className="size-5" aria-hidden />
          המודעה פורסמה בהצלחה!
        </p>
      )}

      <nav aria-label="פירורי לחם" className="mb-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          ראשי
        </Link>
        <span className="mx-1.5" aria-hidden>
          /
        </span>
        <Link href={`/search?category=${listing.category.slug}`} className="hover:text-foreground">
          {listing.category.name}
        </Link>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <ImageGallery images={listing.images.map(imageSrc)} title={listing.title} />

          <section className="mt-6 rounded-2xl border border-border bg-card p-5">
            <h2 className="text-lg font-bold">תיאור</h2>
            <p className="mt-2 leading-relaxed whitespace-pre-line text-foreground">{listing.description}</p>
            <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm sm:grid-cols-4">
              <div>
                <dt className="text-muted-foreground">מצב</dt>
                <dd className="font-semibold">{CONDITION_LABELS[listing.condition]}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">קטגוריה</dt>
                <dd className="font-semibold">{listing.category.name}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">פורסם</dt>
                <dd className="flex items-center gap-1 font-semibold">
                  <Clock className="size-3.5" aria-hidden />
                  {timeAgo(listing.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">צפיות</dt>
                <dd className="flex items-center gap-1 font-semibold">
                  <Eye className="size-3.5" aria-hidden />
                  {listing.views.toLocaleString("he-IL")}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-border bg-card p-5">
            {listing.status !== "ACTIVE" && (
              <p className="mb-3 inline-block rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
                {listing.status === "SOLD" ? "נמכר" : "מוסתר — רק אתם רואים את המודעה"}
              </p>
            )}
            <h1 className="text-2xl leading-snug font-bold">{listing.title}</h1>
            <p className={`mt-2 text-3xl font-extrabold ${listing.price === 0 ? "text-cta" : "text-primary"}`}>
              {formatPrice(listing.price)}
            </p>
            <p className="mt-2 flex items-center gap-1 text-muted-foreground">
              <MapPin className="size-4" aria-hidden />
              {listing.city}
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {isOwner ? (
                <OwnerActions listingId={listing.id} status={listing.status} />
              ) : listing.status === "ACTIVE" ? (
                <>
                  <ContactPanel
                    listingId={listing.id}
                    listingTitle={listing.title}
                    phone={listing.seller.phone}
                    signedIn={!!user}
                  />
                  <FavoriteButton listingId={listing.id} initial={favoriteIds.has(listing.id)} variant="outline" />
                </>
              ) : (
                <p className="text-muted-foreground">הפריט כבר נמכר.</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5">
            <span className="grid size-12 place-items-center rounded-full bg-primary-soft text-primary">
              <User className="size-6" aria-hidden />
            </span>
            <div>
              <p className="font-bold">{listing.seller.name}</p>
              <p className="text-sm text-muted-foreground">
                חבר/ה מאז{" "}
                {new Intl.DateTimeFormat("he-IL", { month: "long", year: "numeric" }).format(listing.seller.createdAt)}
              </p>
            </div>
          </div>

          <Link
            href="/safety"
            className="flex items-start gap-3 rounded-2xl bg-primary-soft p-4 text-sm text-foreground transition-colors duration-200 hover:bg-primary-soft/70"
          >
            <ShieldCheck className="size-5 shrink-0 text-primary" aria-hidden />
            <span>
              <strong>קונים בבטחה:</strong> לא משלמים מראש, בודקים את הפריט ונפגשים במקום ציבורי.
            </span>
          </Link>
        </aside>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similar-title" className="mt-12">
          <h2 id="similar-title" className="mb-4 text-xl font-bold">
            מודעות דומות
          </h2>
          <ListingGrid>
            {similar.map((l) => (
              <ListingCard key={l.id} listing={l} favorited={favoriteIds.has(l.id)} />
            ))}
          </ListingGrid>
        </section>
      )}
    </div>
  );
}
