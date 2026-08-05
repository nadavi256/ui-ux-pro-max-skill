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
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl">כל האירועים</h1>
        <p className="mt-2 text-muted">{events.length} אירועים זמינים כרגע</p>

        <div className="mt-8">
          <Suspense fallback={null}>
            <EventFilters categories={categories} cities={cities} />
          </Suspense>
        </div>

        {events.length === 0 ? (
          <p className="mt-16 text-center text-muted">לא נמצאו אירועים התואמים את החיפוש שלכם.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
