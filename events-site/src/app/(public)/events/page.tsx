import type { Metadata } from "next";
import { Suspense } from "react";
import { EventCard } from "@/components/EventCard";
import { EventFilters } from "@/components/EventFilters";
import { getAllCities, getCategories, getPublishedEvents } from "@/lib/events";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "כל האירועים",
  description: `עיינו בכל המסיבות, ההופעות והפסטיבלים הקרובים ב${siteConfig.name} וסננו לפי עיר, תאריך וקטגוריה.`,
  alternates: { canonical: "/events" },
};

export default async function EventsPage(props: PageProps<"/events">) {
  const searchParams = await props.searchParams;
  const city = typeof searchParams.city === "string" ? searchParams.city : undefined;
  const categorySlug = typeof searchParams.category === "string" ? searchParams.category : undefined;
  const query = typeof searchParams.q === "string" ? searchParams.q : undefined;

  const [events, categories, cities] = await Promise.all([
    getPublishedEvents({ city, categorySlug, query }),
    getCategories(),
    getAllCities(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-black text-foreground sm:text-5xl">אירועים קרובים</h1>
      <p className="mt-3 text-muted-foreground">כל המסיבות וההופעות שבדרך — מסודר לפי תאריך.</p>

      <div className="mt-8">
        <Suspense fallback={null}>
          <EventFilters categories={categories} cities={cities} />
        </Suspense>
      </div>

      {events.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">לא נמצאו אירועים התואמים את החיפוש שלכם.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
