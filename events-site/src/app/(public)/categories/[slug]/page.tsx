import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/EventCard";
import { getCategories, getCategoryBySlug, getPublishedEvents } from "@/lib/events";
import { siteConfig } from "@/lib/site-config";

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata(props: PageProps<"/categories/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: category.name,
    description: `כל האירועים בקטגוריית ${category.name} ב${siteConfig.name}.`,
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

export default async function CategoryPage(props: PageProps<"/categories/[slug]">) {
  const { slug } = await props.params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const events = await getPublishedEvents({ categorySlug: slug });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-black text-foreground sm:text-5xl">{category.name}</h1>
      <p className="mt-3 text-muted-foreground">{events.length} אירועים בקטגוריה זו</p>

      {events.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">אין כרגע אירועים פעילים בקטגוריה זו.</p>
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
