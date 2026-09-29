import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export function Pagination({
  page,
  pageCount,
  params,
}: {
  page: number;
  pageCount: number;
  params: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v && k !== "page") sp.set(k, v);
    if (p > 1) sp.set("page", String(p));
    return `/search?${sp}`;
  };

  const btn =
    "flex h-11 items-center gap-1 rounded-xl border border-border bg-card px-4 text-sm font-semibold transition-colors duration-200 hover:bg-muted";

  return (
    <nav aria-label="עמודים" className="mt-8 flex items-center justify-center gap-3">
      {page > 1 && (
        <Link href={href(page - 1)} className={btn} rel="prev">
          <ChevronRight className="size-4" aria-hidden />
          הקודם
        </Link>
      )}
      <span className="text-sm text-muted-foreground">
        עמוד {page} מתוך {pageCount}
      </span>
      {page < pageCount && (
        <Link href={href(page + 1)} className={btn} rel="next">
          הבא
          <ChevronLeft className="size-4" aria-hidden />
        </Link>
      )}
    </nav>
  );
}
