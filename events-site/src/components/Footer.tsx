import Link from "next/link";
import { getPastEvents } from "@/lib/events";
import { siteConfig } from "@/lib/site-config";

export async function Footer() {
  const pastEvents = await getPastEvents(6);

  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-black text-primary">{siteConfig.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">מוצאים לך את המסיבה הבאה — צפון, מרכז ודרום.</p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground">ניווט מהיר</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/events" className="hover:text-primary">
                  אירועים קרובים
                </Link>
              </li>
              <li>
                <Link href="/tzafon" className="hover:text-primary">
                  צפון
                </Link>
              </li>
              <li>
                <Link href="/merkaz" className="hover:text-primary">
                  מרכז
                </Link>
              </li>
              <li>
                <Link href="/darom" className="hover:text-primary">
                  דרום
                </Link>
              </li>
              <li>
                <Link href="/hofaot" className="hover:text-primary">
                  הופעות
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  אודות
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-foreground">גילוי נאות</h4>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {siteConfig.name} הוא אתר קידום והשוואת אירועים בלבד ואינו מוכר כרטיסים בעצמו. לחיצה על
              &quot;לרכישת כרטיסים&quot; מפנה אתכם לאתר השותף החיצוני המפעיל את המכירה בפועל.
            </p>
            <Link href="/admin/login" className="mt-3 inline-block text-sm text-muted-foreground hover:text-primary">
              כניסת מנהלים
            </Link>
          </div>
        </div>

        {pastEvents.length > 0 && (
          <div className="mt-10 border-t border-border/60 pt-8">
            <h4 className="text-sm font-bold text-foreground">אירועים שהסתיימו</h4>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((e) => (
                <li key={e.id}>
                  <Link href={`/events/${e.slug}`} className="hover:text-primary">
                    {e.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-8 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
}
