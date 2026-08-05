import Image from "next/image";
import Link from "next/link";
import { formatEventDate } from "@/lib/format";

export interface EventCardData {
  slug: string;
  title: string;
  coverImageUrl: string;
  startDate: Date;
  endDate?: Date | null;
  venueName: string;
  city: string;
  priceLabel?: string | null;
  category: { name: string; slug: string };
}

export function EventCard({ event }: { event: EventCardData }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="card-glow group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface cursor-pointer"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={event.coverImageUrl}
          alt={event.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 rounded-full gradient-bg px-3 py-1 text-xs font-semibold text-white shadow">
          {event.category.name}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-brand-pink">
          {formatEventDate(event.startDate, event.endDate)}
        </p>
        <h3 className="text-lg font-bold leading-snug text-foreground line-clamp-2">{event.title}</h3>
        <p className="text-sm text-muted">
          {event.venueName} · {event.city}
        </p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm font-semibold text-foreground">{event.priceLabel ?? "פרטי מחיר באתר"}</span>
          <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-foreground group-hover:bg-cta group-hover:text-white transition-colors">
            לפרטים ולרכישה
          </span>
        </div>
      </div>
    </Link>
  );
}
