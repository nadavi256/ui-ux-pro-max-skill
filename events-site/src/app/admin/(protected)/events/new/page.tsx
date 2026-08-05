import { EventForm } from "@/components/admin/EventForm";
import { createEventAction } from "@/lib/actions/event-actions";
import { getCategories } from "@/lib/events";

export default async function NewEventPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="text-2xl font-extrabold">אירוע חדש</h1>
      <div className="mt-6">
        <EventForm action={createEventAction} categories={categories} submitLabel="יצירת אירוע" />
      </div>
    </div>
  );
}
