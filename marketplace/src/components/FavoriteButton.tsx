"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { toggleFavoriteAction } from "@/lib/actions/listing-actions";

export function FavoriteButton({
  listingId,
  initial,
  variant = "overlay",
}: {
  listingId: string;
  initial: boolean;
  variant?: "overlay" | "outline";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [favorited, setFavorited] = useOptimistic(initial);

  function toggle() {
    startTransition(async () => {
      setFavorited(!favorited);
      const result = await toggleFavoriteAction(listingId);
      if ("error" in result) router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      else router.refresh();
    });
  }

  const label = favorited ? "הסרה מהמועדפים" : "שמירה במועדפים";
  const icon = <Heart className={`size-5 ${favorited ? "fill-destructive text-destructive" : ""}`} aria-hidden />;

  if (variant === "outline") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={favorited}
        className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 font-semibold text-foreground transition-colors duration-200 hover:bg-muted"
      >
        {icon}
        {favorited ? "נשמר במועדפים" : "שמירה"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      aria-pressed={favorited}
      className="grid size-10 place-items-center rounded-full bg-card/90 text-foreground shadow-sm backdrop-blur transition-colors duration-200 hover:bg-card"
    >
      {icon}
    </button>
  );
}
