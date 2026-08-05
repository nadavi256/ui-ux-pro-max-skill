import Link from "next/link";
import { ClickChart } from "@/components/admin/ClickChart";
import { StatCard } from "@/components/admin/StatCard";
import { getClickTimeline, getDashboardStats } from "@/lib/admin-data";

export default async function AdminDashboardPage() {
  const [stats, timeline] = await Promise.all([getDashboardStats(), getClickTimeline(14)]);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">לוח בקרה</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="סה״כ אירועים" value={stats.totalEvents} />
        <StatCard label="פורסמו" value={stats.publishedEvents} />
        <StatCard label="טיוטות" value={stats.draftEvents} />
        <StatCard label="קטגוריות" value={stats.totalCategories} />
        <StatCard label="קליקים לשותפים" value={stats.totalClicks} />
        <StatCard label="משתמשים" value={stats.totalUsers} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-bold">קליקים ב-14 הימים האחרונים</h2>
          <div className="mt-6">
            <ClickChart data={timeline} />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-bold">האירועים המובילים בקליקים</h2>
          <ul className="mt-4 flex flex-col gap-3">
            {stats.topEvents.map((event) => (
              <li key={event.id} className="flex items-center justify-between text-sm">
                <Link href={`/admin/events/${event.id}/edit`} className="text-foreground hover:text-brand-pink truncate">
                  {event.title}
                </Link>
                <span className="shrink-0 font-semibold text-brand-pink">{event._count.clicks}</span>
              </li>
            ))}
            {stats.topEvents.length === 0 && <p className="text-sm text-muted">אין עדיין נתוני קליקים.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}
