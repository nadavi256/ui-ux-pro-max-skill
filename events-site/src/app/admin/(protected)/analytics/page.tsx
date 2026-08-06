import Link from "next/link";
import { ClickChart } from "@/components/admin/ClickChart";
import { getAllEventsForAdmin } from "@/lib/admin-data";
import { getClickTimeline } from "@/lib/admin-data";

export default async function AdminAnalyticsPage() {
  const [events, timeline] = await Promise.all([getAllEventsForAdmin(), getClickTimeline(30)]);
  const sorted = [...events].sort((a, b) => b._count.clicks - a._count.clicks);
  const totalClicks = events.reduce((sum, e) => sum + e._count.clicks, 0);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">אנליטיקס קליקים</h1>
      <p className="mt-2 text-muted-foreground">סה״כ {totalClicks} קליקים לאתרי שותפים מתחילת הפעילות.</p>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-bold">קליקים ב-30 הימים האחרונים</h2>
        <div className="mt-6">
          <ClickChart data={timeline} />
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border bg-card text-right text-muted-foreground">
              <th className="px-4 py-3 font-medium">אירוע</th>
              <th className="px-4 py-3 font-medium">עיר</th>
              <th className="px-4 py-3 font-medium">קליקים</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((event) => (
              <tr key={event.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">
                  <Link href={`/admin/events/${event.id}/edit`} className="hover:text-primary">
                    {event.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{event.city}</td>
                <td className="px-4 py-3 font-semibold text-primary">{event._count.clicks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
