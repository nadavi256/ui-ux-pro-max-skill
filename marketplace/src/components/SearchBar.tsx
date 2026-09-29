import { Search } from "lucide-react";

// Plain GET form → /search?q=… so it works without JS and is shareable.
export function SearchBar({ defaultValue, size = "md" }: { defaultValue?: string; size?: "md" | "lg" }) {
  const lg = size === "lg";
  return (
    <form action="/search" role="search" className="relative w-full">
      <label htmlFor={lg ? "hero-search" : "header-search"} className="sr-only">
        חיפוש מודעות
      </label>
      <Search
        className={`pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground ${lg ? "size-5" : "size-4"}`}
        aria-hidden
      />
      <input
        id={lg ? "hero-search" : "header-search"}
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="מה מחפשים? ספה, אופניים, אייפון…"
        className={`w-full rounded-full border border-border bg-card pr-11 pl-24 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none ${lg ? "h-14 text-base shadow-lg shadow-primary/10" : "h-11 text-sm"}`}
      />
      <button
        type="submit"
        className={`absolute top-1/2 left-1.5 -translate-y-1/2 rounded-full bg-primary px-5 font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-hover ${lg ? "h-11 text-base" : "h-8 text-sm"}`}
      >
        חיפוש
      </button>
    </form>
  );
}
