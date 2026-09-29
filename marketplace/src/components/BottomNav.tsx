"use client";

import { Heart, House, MessageCircle, Plus, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "ראשי", icon: House },
  { href: "/favorites", label: "מועדפים", icon: Heart },
  { href: "/post", label: "פרסום", icon: Plus, primary: true },
  { href: "/messages", label: "הודעות", icon: MessageCircle },
  { href: "/me", label: "אישי", icon: User },
];

// Mobile-only tab bar (thumb zone). Desktop uses the header links.
export function BottomNav({ unread = 0 }: { unread?: number }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="ניווט תחתון"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {items.map(({ href, label, icon: Icon, primary }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-16 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors duration-200 ${active ? "text-primary" : "text-muted-foreground"}`}
              >
                {primary ? (
                  <span className="grid size-10 place-items-center rounded-full bg-cta text-cta-foreground shadow-md shadow-cta/30">
                    <Icon className="size-5" aria-hidden />
                  </span>
                ) : (
                  <Icon className="size-5" aria-hidden />
                )}
                {label}
                {href === "/messages" && unread > 0 && (
                  <span className="absolute top-2 left-1/2 -translate-x-3 size-2.5 rounded-full bg-destructive" aria-hidden />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
