import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard, ListingGrid } from "@/components/ListingCard";
import { Pagination } from "@/components/Pagination";
import { SearchBar } from "@/components/SearchBar";
import { SearchFilters } from "@/components/SearchFilters";
import { getCategories, getFavoriteIds, searchListings, type SearchParams } from "@/lib/listings";
import { getCurrentUser } from "@/lib/session";

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function readParams(props: PageProps<"/search">): Promise<SearchParams> {
  const sp = await props.searchParams;
  const keys = ["q", "category", "city", "condition", "minPrice", "maxPrice", "sort", "page"] as const;
  return Object.fromEntries(keys.map((k) => [k, first(sp[k]) || undefined]));
}

export async function generateMetadata(props: PageProps<"/search">): Promise<Metadata> {
  const params = await readParams(props);
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === params.category);
  const parts = [params.q, category?.name, params.city].filter(Boolean);
  return {
    title: parts.length ? `${parts.join(" · ")} — יד שנייה` : "כל המודעות",
    alternates: { canonical: category ? `/search?category=${category.slug}` : "/search" },
  };
}

export default async function SearchPage(props: PageProps<"/search">) {
  const params = await readParams(props);
  const user = await getCurrentUser();
  const [categories, result, favoriteIds] = await Promise.all([
    getCategories(),
    searchListings(params),
    getFavoriteIds(user?.id),
  ]);
  const category = categories.find((c) => c.slug === params.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-4 md:hidden">
        <SearchBar defaultValue={params.q} />
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <aside className="md:sticky md:top-20 md:w-64 md:shrink-0">
          <SearchFilters categories={categories} params={params} />
        </aside>
        <section className="min-w-0 flex-1" aria-labelledby="results-title">
          <h1 id="results-title" className="text-xl font-bold md:text-2xl">
            {params.q ? `תוצאות עבור "${params.q}"` : (category?.name ?? "כל המודעות")}
          </h1>
          <p className="mt-1 mb-4 text-sm text-muted-foreground" aria-live="polite">
            {result.total.toLocaleString("he-IL")} מודעות
          </p>
          {result.items.length ? (
            <ListingGrid>
              {result.items.map((l, i) => (
                <ListingCard key={l.id} listing={l} favorited={favoriteIds.has(l.id)} priority={i < 4} />
              ))}
            </ListingGrid>
          ) : (
            <EmptyState
              icon={SearchX}
              title="לא מצאנו מודעות מתאימות"
              text="נסו מילות חיפוש אחרות או הסירו חלק מהסינונים."
              action={{ href: "/search", label: "לכל המודעות" }}
            />
          )}
          <Pagination page={result.page} pageCount={result.pageCount} params={{ ...params }} />
        </section>
      </div>
    </div>
  );
}
