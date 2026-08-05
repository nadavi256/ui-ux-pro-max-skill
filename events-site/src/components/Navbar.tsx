import Link from "next/link";
import { getCategories } from "@/lib/events";
import { siteConfig } from "@/lib/site-config";
import { MobileMenu } from "@/components/MobileMenu";

export async function Navbar() {
  const categories = await getCategories();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-extrabold tracking-tight gradient-text">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="ניווט ראשי">
          <Link href="/events" className="text-sm font-medium text-foreground/90 hover:text-foreground transition-colors">
            כל האירועים
          </Link>
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <Link
          href="/events"
          className="hidden md:inline-flex items-center rounded-full gradient-bg px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-purple-900/30 transition-transform hover:scale-105 cursor-pointer"
        >
          מצאו אירוע
        </Link>

        <MobileMenu categories={categories} />
      </div>
    </header>
  );
}
