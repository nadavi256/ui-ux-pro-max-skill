import Link from "next/link";
import { Sparkles, MapPin, ShieldCheck, CalendarClock, Ticket, Bell } from "lucide-react";
import { EventCard } from "@/components/EventCard";
import { getFeaturedEvents, getPublishedEvents } from "@/lib/events";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site-config";

const REGIONS = [
  { href: "/tzafon", label: "צפון" },
  { href: "/merkaz", label: "מרכז" },
  { href: "/darom", label: "דרום" },
  { href: "/hofaot", label: "הופעות" },
] as const;

const FEATURES = [
  { icon: Sparkles, text: "ריכוז כל המסיבות, הפסטיבלים וההופעות בישראל במקום אחד, מתעדכן בכל יום." },
  { icon: MapPin, text: "סינון לפי אזור — צפון, מרכז ודרום — כדי למצוא את מה שקרוב אליכם." },
  { icon: Ticket, text: "כל אירוע מקושר ישירות לאתר השותף הרשמי לרכישת כרטיסים, בלי הפתעות." },
  { icon: ShieldCheck, text: "האתר עצמו אינו מוכר כרטיסים ואינו מבצע סליקה — אתם קונים ישירות מהמפיק." },
  { icon: CalendarClock, text: "אירועים חדשים נוספים באופן שוטף, כולל סנכרון אוטומטי ממקורות נוספים." },
  { icon: Bell, text: "אירועים מומלצים ומודגשים בדף הבית כדי שלא תפספסו את החם ביותר." },
];

export default async function HomePage() {
  const [featuredEvents, upcomingCount, eventsWithCities] = await Promise.all([
    getFeaturedEvents(6),
    prisma.event.count({ where: { status: "PUBLISHED", startDate: { gte: new Date() } } }),
    getPublishedEvents(),
  ]);

  const cityCount = new Set(eventsWithCities.map((e) => e.city)).size;
  const categoryCount = new Set(eventsWithCities.map((e) => e.category.slug)).size;

  const stats = [
    { value: `${upcomingCount}+`, label: "אירועים קרובים" },
    { value: `${cityCount}`, label: "אזורים בישראל" },
    { value: `${categoryCount}`, label: "קטגוריות אירועים" },
    { value: "24/7", label: "עדכונים שוטפים" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,oklch(0.82_0.15_85/0.25),transparent_50%),radial-gradient(circle_at_80%_80%,oklch(0.5_0.2_300/0.2),transparent_50%)]" />
        <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> חיי הלילה של ישראל במקום אחד
          </span>
          <h1 className="mt-6 text-4xl font-black leading-tight text-foreground sm:text-6xl">
            {siteConfig.name} — ריכוז מסיבות וחיי לילה בישראל
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{siteConfig.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/events"
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 cursor-pointer"
            >
              לאירועים הקרובים
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground hover:border-primary/60 cursor-pointer"
            >
              עוד עלינו
            </Link>
          </div>
        </div>
      </section>

      {/* Regions quick nav */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REGIONS.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group rounded-2xl border border-border/60 bg-card p-6 text-center transition-all hover:border-primary/60 cursor-pointer"
            >
              <MapPin className="mx-auto h-6 w-6 text-primary" aria-hidden="true" />
              <div className="mt-2 text-lg font-bold text-foreground group-hover:text-primary">{r.label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-3xl font-black text-foreground sm:text-4xl">מי אנחנו</h2>
        <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
          {siteConfig.name} הוא אתר קידום אירועים שנועד לרכז במקום אחד את כל המסיבות, הפסטיבלים וההופעות
          החמות בישראל. אנחנו אוספים אירועים מכל רחבי הארץ — צפון, מרכז ודרום — ומחברים אתכם ישירות לאתרי
          השותפים הרשמיים לרכישת כרטיסים.
        </p>
      </section>

      {/* Features */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-center text-3xl font-black text-foreground sm:text-4xl">למה {siteConfig.name}</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex gap-4 rounded-2xl border border-border/60 bg-card p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="text-sm leading-relaxed text-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured events */}
      {featuredEvents.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex items-end justify-between">
            <h2 className="text-3xl font-black text-foreground sm:text-4xl">אירועים קרובים</h2>
            <Link href="/events" className="text-sm font-semibold text-primary hover:underline">
              לכל האירועים ←
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="border-y border-border/60 bg-card/40">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black text-primary">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
