import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
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
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:border-primary/60 hover:shadow-lg hover:shadow-primary/10 cursor-pointer"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/30 via-secondary to-background">
        <Image
          src={event.coverImageUrl}
          alt={event.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="pointer-events-none absolute top-3 right-3 flex gap-2">
          <span className="rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-primary-foreground">
            {event.category.name}
          </span>
          <span className="rounded-full bg-background/80 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
            {event.city}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="text-lg font-bold text-foreground group-hover:text-primary">{event.title}</h3>
        <p className="text-sm text-muted-foreground">{event.priceLabel ?? "פרטי מחיר בעמוד האירוע"}</p>
        <div className="mt-auto flex flex-wrap gap-3 pt-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            {formatEventDate(event.startDate, event.endDate)}
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {event.venueName}
          </span>
        </div>
      </div>
    </Link>
  );
}
