import { notFound } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { getEventForEdit } from "@/lib/admin-data";
import { updateEventAction } from "@/lib/actions/event-actions";
import { getCategories } from "@/lib/events";
import { toDateTimeLocalValue } from "@/lib/datetime-local";

export default async function EditEventPage(props: PageProps<"/admin/events/[id]/edit">) {
  const { id } = await props.params;
  const [event, categories] = await Promise.all([getEventForEdit(id), getCategories()]);
  if (!event) notFound();

  const action = updateEventAction.bind(null, event.id);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">עריכת אירוע</h1>
      <div className="mt-6">
        <EventForm
          action={action}
          categories={categories}
          submitLabel="שמירת שינויים"
          defaults={{
            title: event.title,
            description: event.description,
            coverImageUrl: event.coverImageUrl,
            startDate: toDateTimeLocalValue(event.startDate),
            endDate: event.endDate ? toDateTimeLocalValue(event.endDate) : "",
            venueName: event.venueName,
            city: event.city,
            address: event.address ?? "",
            priceLabel: event.priceLabel ?? "",
            affiliateUrl: event.affiliateUrl,
            affiliateNetwork: event.affiliateNetwork ?? "",
            categoryId: event.categoryId,
            status: event.status,
            featured: event.featured,
            metaTitle: event.metaTitle ?? "",
            metaDescription: event.metaDescription ?? "",
          }}
        />
      </div>
    </div>
  );
}
