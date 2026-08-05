import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold gradient-text">{siteConfig.name}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{siteConfig.description}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">ניווט</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  דף הבית
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-foreground transition-colors">
                  כל האירועים
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-foreground transition-colors">
                  כניסת מנהלים
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground">גילוי נאות</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {siteConfig.name} הוא אתר קידום והשוואת אירועים בלבד ואינו מוכר כרטיסים בעצמו. לחיצה על
              &quot;לרכישת כרטיסים&quot; מפנה אתכם לאתר השותף החיצוני המפעיל את המכירה בפועל, ואנו עשויים
              לקבל עמלת שותפים מהזמנות שבוצעו דרך קישורים אלו. כל התשלום, האספקה והשירות הם באחריות
              השותף החיצוני בלבד.
            </p>
          </div>
        </div>

        <p className="mt-10 border-t border-border pt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name}. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  );
}
