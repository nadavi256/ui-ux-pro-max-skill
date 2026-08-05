import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { getCategories, getFeaturedEvents } from "@/lib/events";
import { siteConfig } from "@/lib/site-config";

export default async function HomePage() {
  const [featuredEvents, categories] = await Promise.all([getFeaturedEvents(8), getCategories()]);

  return (
    <>
      <section className="hero-glow relative overflow-hidden px-4 pb-16 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
            כל המסיבות וההופעות
            <br />
            <span className="gradient-text">במקום אחד</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">{siteConfig.description}</p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-full gradient-bg px-8 py-4 text-base font-bold text-white shadow-xl shadow-purple-900/30 transition-transform hover:scale-105 cursor-pointer"
            >
              גלו אירועים
            </Link>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-brand-pink hover:text-brand-pink cursor-pointer"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredEvents.length > 0 && (
        <section className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-2xl font-bold sm:text-3xl">אירועים מומלצים</h2>
              <Link href="/events" className="text-sm font-semibold text-brand-pink hover:underline">
                לכל האירועים ←
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
