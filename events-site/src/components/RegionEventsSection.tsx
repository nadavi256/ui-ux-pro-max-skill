import { EventCard } from "@/components/EventCard";
import { getPublishedEvents, type EventFilters } from "@/lib/events";

export async function RegionEventsSection({
  title,
  subtitle,
  filters,
}: {
  title: string;
  subtitle: string;
  filters: EventFilters;
}) {
  const events = await getPublishedEvents(filters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-4xl font-black text-foreground sm:text-5xl">{title}</h1>
      <p className="mt-3 text-muted-foreground">{subtitle}</p>

      {events.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">אין כרגע אירועים זמינים באזור זה.</p>
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
