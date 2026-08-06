"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function EventFilters({ categories, cities }: { categories: Category[]; cities: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`/events?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center" aria-busy={isPending}>
      <label className="flex-1">
        <span className="sr-only">חיפוש אירועים</span>
        <input
          type="search"
          defaultValue={searchParams.get("q") ?? ""}
          placeholder="חיפוש לפי שם, אולם או עיר..."
          onChange={(e) => updateParam("q", e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </label>

      <label className="sm:w-48">
        <span className="sr-only">עיר</span>
        <select
          defaultValue={searchParams.get("city") ?? ""}
          onChange={(e) => updateParam("city", e.target.value)}
          className="w-full cursor-pointer rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="">כל הערים</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label className="sm:w-56">
        <span className="sr-only">קטגוריה</span>
        <select
          defaultValue={searchParams.get("category") ?? ""}
          onChange={(e) => updateParam("category", e.target.value)}
          className="w-full cursor-pointer rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="">כל הקטגוריות</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
