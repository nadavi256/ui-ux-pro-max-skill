import { ArrowLeft, Gift, MessageCircle, ShieldCheck, Tag } from "lucide-react";
import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { EmptyState } from "@/components/EmptyState";
import { ListingCard, ListingGrid } from "@/components/ListingCard";
import { SearchBar } from "@/components/SearchBar";
import { getCategories, getFavoriteIds, getFreeListings, getLatestListings } from "@/lib/listings";
import { getCurrentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const user = await getCurrentUser();
  const [categories, latest, free, favoriteIds] = await Promise.all([
    getCategories(),
    getLatestListings(15),
    getFreeListings(5),
    getFavoriteIds(user?.id),
  ]);

  return (
    <>
      {/* Hero: search is the primary CTA (marketplace pattern) */}
      <section className="bg-gradient-to-b from-primary-soft to-background">
        <div className="mx-auto max-w-3xl px-4 pt-10 pb-8 text-center md:pt-16 md:pb-12">
          <h1 className="text-3xl leading-tight font-extrabold md:text-5xl">
            המציאה הבאה שלך
            <br className="hidden sm:block" /> <span className="text-primary">ממש קרוב לבית</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground md:text-lg">
            אלפי פריטי יד שנייה מאנשים בסביבה. קונים חכם, מוכרים בקלות — ופרסום מודעה בחינם.
          </p>
          <div className="mt-6">
            <SearchBar size="lg" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4">
        <section aria-labelledby="cats-title" className="mt-2">
          <h2 id="cats-title" className="sr-only">
            קטגוריות
          </h2>
          <ul className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-6 md:px-0 lg:grid-cols-12">
            {categories.map((c) => (
              <li key={c.id} className="shrink-0">
                <Link
                  href={`/search?category=${c.slug}`}
                  className="flex w-20 flex-col items-center gap-2 rounded-2xl p-2 text-center text-xs font-medium text-foreground transition-colors duration-200 hover:bg-card md:w-auto"
                >
                  <span className="grid size-14 place-items-center rounded-2xl border border-border bg-card text-primary shadow-sm">
                    <CategoryIcon name={c.icon} className="size-6" />
                  </span>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="latest-title" className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <h2 id="latest-title" className="text-xl font-bold md:text-2xl">
              מודעות חדשות
            </h2>
            <Link href="/search" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
              לכל המודעות
              <ArrowLeft className="size-4" aria-hidden />
            </Link>
          </div>
          {latest.length ? (
            <ListingGrid>
              {latest.map((l, i) => (
                <ListingCard key={l.id} listing={l} favorited={favoriteIds.has(l.id)} priority={i < 4} />
              ))}
            </ListingGrid>
          ) : (
            <EmptyState
              icon={Tag}
              title="עדיין אין מודעות"
              text="היו הראשונים לפרסם — זה לוקח פחות מדקה."
              action={{ href: "/post", label: "פרסום מודעה" }}
            />
          )}
        </section>

        {free.length > 0 && (
          <section aria-labelledby="free-title" className="mt-12">
            <div className="mb-4 flex items-end justify-between">
              <h2 id="free-title" className="flex items-center gap-2 text-xl font-bold md:text-2xl">
                <Gift className="size-6 text-cta" aria-hidden />
                למסירה בחינם
              </h2>
              <Link
                href="/search?maxPrice=0"
                className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                עוד
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
            </div>
            <ListingGrid>
              {free.map((l) => (
                <ListingCard key={l.id} listing={l} favorited={favoriteIds.has(l.id)} />
              ))}
            </ListingGrid>
          </section>
        )}

        <section aria-labelledby="how-title" className="mt-14 grid gap-4 md:grid-cols-3">
          <h2 id="how-title" className="sr-only">
            איך זה עובד
          </h2>
          {[
            { icon: Tag, title: "מפרסמים בחינם", text: "מצלמים, כותבים שתי שורות, ומפרסמים. בלי עמלות." },
            { icon: MessageCircle, title: "מדברים ישירות", text: "צ׳אט באתר, טלפון או וואטסאפ — איך שנוח לכם." },
            { icon: ShieldCheck, title: "נפגשים בבטחה", text: "בודקים את הפריט לפני תשלום ונפגשים במקום ציבורי." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-6" aria-hidden />
              </span>
              <div>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-primary px-6 py-10 text-center text-primary-foreground md:flex-row md:justify-between md:px-12 md:text-right">
          <div>
            <h2 className="text-2xl font-extrabold">יש לכם משהו שכבר לא בשימוש?</h2>
            <p className="mt-1 text-primary-foreground/85">תנו לו חיים חדשים — ותרוויחו על הדרך.</p>
          </div>
          <Link
            href="/post"
            className="shrink-0 rounded-xl bg-card px-8 py-3.5 font-bold text-primary transition-colors duration-200 hover:bg-primary-soft"
          >
            פרסום מודעה בחינם
          </Link>
        </section>
      </div>
    </>
  );
}
