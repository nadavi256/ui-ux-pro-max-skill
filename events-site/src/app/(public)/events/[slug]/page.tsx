import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPublishedSlugs, getEventBySlug } from "@/lib/events";
import { formatEventDate } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";

export async function generateStaticParams() {
  const events = await getAllPublishedSlugs();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata(props: PageProps<"/events/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const event = await getEventBySlug(slug);
  if (!event) return {};

  const title = event.metaTitle || `${event.title} — ${event.city}`;
  const description = event.metaDescription || event.description.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical: `/events/${event.slug}` },
    openGraph: {
      title,
      description,
      images: [{ url: event.coverImageUrl }],
    },
  };
}

export default async function EventDetailPage(props: PageProps<"/events/[slug]">) {
  const { slug } = await props.params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.startDate.toISOString(),
    ...(event.endDate ? { endDate: event.endDate.toISOString() } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: event.venueName,
      address: {
        "@type": "PostalAddress",
        streetAddress: event.address ?? undefined,
        addressLocality: event.city,
        addressCountry: "IL",
      },
    },
    image: [event.coverImageUrl],
    description: event.description,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/out/${event.slug}`,
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <article className="px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-4xl">
        <nav className="mb-6 text-sm text-muted-foreground" aria-label="פירורי לחם">
          <Link href="/" className="hover:text-foreground">
            דף הבית
          </Link>{" "}
          /{" "}
          <Link href="/events" className="hover:text-foreground">
            אירועים
          </Link>{" "}
          / <span className="text-foreground">{event.title}</span>
        </nav>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/30 via-secondary to-background">
          <Image src={event.coverImageUrl} alt={event.title} fill priority className="object-cover" />
        </div>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              {event.category.name}
            </span>
            <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{event.title}</h1>
            <p className="mt-3 font-semibold text-primary">{formatEventDate(event.startDate, event.endDate)}</p>
            <p className="mt-1 text-muted-foreground">
              {event.venueName} · {event.city}
              {event.address ? ` · ${event.address}` : ""}
            </p>
          </div>

          <div className="w-full rounded-2xl border border-border/60 bg-card p-6 sm:w-72">
            <p className="text-sm text-muted-foreground">מחיר</p>
            <p className="mt-1 text-2xl font-black">{event.priceLabel ?? "פרטי מחיר באתר השותף"}</p>
            <a
              href={`/out/${event.slug}`}
              rel="sponsored nofollow noopener"
              className="mt-5 flex w-full items-center justify-center rounded-full bg-primary px-6 py-4 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 cursor-pointer"
            >
              לרכישת כרטיסים ←
            </a>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              הקישור מפנה לאתר השותף החיצוני המפעיל את המכירה בפועל.
            </p>
          </div>
        </div>

        <div className="prose prose-invert mt-10 max-w-none">
          <h2 className="text-xl font-bold">על האירוע</h2>
          <p className="mt-3 leading-relaxed text-foreground/90 whitespace-pre-line">{event.description}</p>
        </div>
      </div>
    </article>
  );
}
