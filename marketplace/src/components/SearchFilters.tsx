import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import type { Category } from "@/generated/prisma/client";
import { CITIES, CONDITION_LABELS, CONDITIONS, SORT_OPTIONS } from "@/lib/constants";
import type { SearchParams } from "@/lib/listings";

const selectClass =
  "h-11 w-full rounded-xl border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";

// GET form: filters live in the URL so results are shareable & crawlable.
// Rendered twice: collapsed <details> on mobile, always-open panel on desktop.
export function SearchFilters({ categories, params }: { categories: Category[]; params: SearchParams }) {
  const activeCount = [params.category, params.city, params.condition, params.minPrice, params.maxPrice].filter(
    Boolean,
  ).length;

  return (
    <>
      <details className="rounded-2xl border border-border bg-card md:hidden">
        <summary className="flex h-12 items-center gap-2 px-4 font-semibold [&::-webkit-details-marker]:hidden">
          <SlidersHorizontal className="size-4" aria-hidden />
          סינון ומיון
          {activeCount > 0 && (
            <span className="rounded-full bg-primary px-2 text-xs leading-5 text-primary-foreground">{activeCount}</span>
          )}
        </summary>
        <FiltersForm idPrefix="m" categories={categories} params={params} activeCount={activeCount} />
      </details>
      <div className="hidden rounded-2xl border border-border bg-card md:block">
        <h2 className="flex items-center gap-2 px-4 pt-4 font-bold">
          <SlidersHorizontal className="size-4" aria-hidden />
          סינון ומיון
        </h2>
        <FiltersForm idPrefix="d" categories={categories} params={params} activeCount={activeCount} />
      </div>
    </>
  );
}

function FiltersForm({
  idPrefix,
  categories,
  params,
  activeCount,
}: {
  idPrefix: string;
  categories: Category[];
  params: SearchParams;
  activeCount: number;
}) {
  const id = (name: string) => `${idPrefix}-${name}`;
  return (
      <form action="/search" className="flex flex-col gap-4 border-t border-border p-4 md:border-t-0">
        {params.q && <input type="hidden" name="q" value={params.q} />}

        <div className="flex flex-col gap-1.5">
          <label htmlFor={id("category")} className="text-sm font-semibold">
            קטגוריה
          </label>
          <select id={id("category")} name="category" defaultValue={params.category ?? ""} className={selectClass}>
            <option value="">כל הקטגוריות</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={id("city")} className="text-sm font-semibold">
            אזור / עיר
          </label>
          <select id={id("city")} name="city" defaultValue={params.city ?? ""} className={selectClass}>
            <option value="">כל הארץ</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1.5 text-sm font-semibold">מחיר (₪)</legend>
          <div className="flex items-center gap-2">
            <label htmlFor={id("min")} className="sr-only">
              מחיר מינימלי
            </label>
            <input
              id={id("min")}
              name="minPrice"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="מ-"
              defaultValue={params.minPrice}
              className={selectClass}
            />
            <span className="text-muted-foreground" aria-hidden>
              –
            </span>
            <label htmlFor={id("max")} className="sr-only">
              מחיר מקסימלי
            </label>
            <input
              id={id("max")}
              name="maxPrice"
              type="number"
              inputMode="numeric"
              min={0}
              placeholder="עד"
              defaultValue={params.maxPrice}
              className={selectClass}
            />
          </div>
        </fieldset>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={id("condition")} className="text-sm font-semibold">
            מצב הפריט
          </label>
          <select id={id("condition")} name="condition" defaultValue={params.condition ?? ""} className={selectClass}>
            <option value="">הכל</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {CONDITION_LABELS[c]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={id("sort")} className="text-sm font-semibold">
            מיון
          </label>
          <select id={id("sort")} name="sort" defaultValue={params.sort ?? "new"} className={selectClass}>
            {Object.entries(SORT_OPTIONS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="h-11 rounded-xl bg-primary font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-hover"
        >
          הצגת תוצאות
        </button>
        {activeCount > 0 && (
          <Link
            href={params.q ? `/search?q=${encodeURIComponent(params.q)}` : "/search"}
            className="text-center text-sm font-medium text-primary hover:underline"
          >
            ניקוי סינונים
          </Link>
        )}
      </form>
  );
}
