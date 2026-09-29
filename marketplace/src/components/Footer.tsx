import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card pb-20 md:pb-0">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {siteConfig.name} — {siteConfig.tagline}
        </p>
        <nav className="flex gap-5" aria-label="קישורי תחתית">
          <Link href="/safety" className="hover:text-foreground">
            טיפים לקנייה בטוחה
          </Link>
          <Link href="/search" className="hover:text-foreground">
            כל המודעות
          </Link>
          <Link href="/post" className="hover:text-foreground">
            פרסום מודעה
          </Link>
        </nav>
      </div>
    </footer>
  );
}
