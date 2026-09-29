import { Heart, LogOut, MessageCircle, Plus, User } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";
import { logoutAction } from "@/lib/actions/auth-actions";
import { countUnreadMessages } from "@/lib/listings";
import { getCurrentUser } from "@/lib/session";

export async function Header() {
  const user = await getCurrentUser();
  const unread = user ? await countUnreadMessages(user.id) : 0;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4">
        <Logo />
        <div className="hidden flex-1 md:block md:max-w-xl">
          <SearchBar />
        </div>
        <nav className="ms-auto flex items-center gap-1" aria-label="ניווט ראשי">
          {user ? (
            <>
              <IconLink href="/favorites" label="מועדפים" className="hidden md:grid">
                <Heart className="size-5" aria-hidden />
              </IconLink>
              <IconLink href="/messages" label="הודעות" className="hidden md:grid" badge={unread}>
                <MessageCircle className="size-5" aria-hidden />
              </IconLink>
              <IconLink href="/me" label="האזור האישי" className="hidden md:grid">
                <User className="size-5" aria-hidden />
              </IconLink>
              <form action={logoutAction} className="hidden md:block">
                <button
                  type="submit"
                  aria-label="התנתקות"
                  className="grid size-11 place-items-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="size-5" aria-hidden />
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-4 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-muted"
            >
              התחברות
            </Link>
          )}
          <Link
            href="/post"
            className="hidden items-center gap-1.5 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground transition-colors duration-200 hover:bg-cta-hover md:flex"
          >
            <Plus className="size-4" aria-hidden />
            פרסום מודעה
          </Link>
        </nav>
      </div>
    </header>
  );
}

function IconLink({
  href,
  label,
  badge,
  className = "",
  children,
}: {
  href: string;
  label: string;
  badge?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={badge ? `${label} (${badge} חדשות)` : label}
      className={`relative size-11 place-items-center rounded-full text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground ${className}`}
    >
      {children}
      {!!badge && (
        <span className="absolute top-1.5 left-1.5 grid min-w-4.5 place-items-center rounded-full bg-destructive px-1 text-[10px] leading-4.5 font-bold text-white">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </Link>
  );
}
