import Link from "next/link";
import { getAllEventsForAdmin } from "@/lib/admin-data";
import { deleteEventAction } from "@/lib/actions/event-actions";
import { DeleteButton } from "@/components/admin/DeleteButton";

const STATUS_LABEL: Record<string, string> = {
  DRAFT: "טיוטה",
  PUBLISHED: "פורסם",
  ARCHIVED: "בארכיון",
};

export default async function AdminEventsPage() {
  const events = await getAllEventsForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">אירועים</h1>
        <Link
          href="/admin/events/new"
          className="rounded-full gradient-bg px-5 py-2.5 text-sm font-semibold text-white cursor-pointer"
        >
          + אירוע חדש
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-right text-muted">
              <th className="px-4 py-3 font-medium">כותרת</th>
              <th className="px-4 py-3 font-medium">קטגוריה</th>
              <th className="px-4 py-3 font-medium">עיר</th>
              <th className="px-4 py-3 font-medium">סטטוס</th>
              <th className="px-4 py-3 font-medium">קליקים</th>
              <th className="px-4 py-3 font-medium">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{event.title}</td>
                <td className="px-4 py-3 text-muted">{event.category.name}</td>
                <td className="px-4 py-3 text-muted">{event.city}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs">{STATUS_LABEL[event.status]}</span>
                </td>
                <td className="px-4 py-3 text-muted">{event._count.clicks}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/events/${event.id}/edit`} className="text-brand-pink hover:underline cursor-pointer">
                      עריכה
                    </Link>
                    <form action={deleteEventAction}>
                      <input type="hidden" name="id" value={event.id} />
                      <DeleteButton confirmMessage={`למחוק את האירוע "${event.title}"? פעולה זו אינה הפיכה.`} />
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  אין עדיין אירועים. לחצו על &quot;אירוע חדש&quot; כדי להתחיל.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
