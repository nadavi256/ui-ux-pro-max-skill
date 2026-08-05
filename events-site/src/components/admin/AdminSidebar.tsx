"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth-actions";
import { siteConfig } from "@/lib/site-config";
import type { Role } from "@/generated/prisma/client";

const NAV_ITEMS: { href: string; label: string; minRole: Role }[] = [
  { href: "/admin", label: "לוח בקרה", minRole: "VIEWER" },
  { href: "/admin/events", label: "אירועים", minRole: "VIEWER" },
  { href: "/admin/categories", label: "קטגוריות", minRole: "EDITOR" },
  { href: "/admin/analytics", label: "אנליטיקס קליקים", minRole: "VIEWER" },
  { href: "/admin/users", label: "משתמשים", minRole: "SUPER_ADMIN" },
];

const ROLE_RANK: Record<Role, number> = { VIEWER: 0, EDITOR: 1, SUPER_ADMIN: 2 };

export function AdminSidebar({ userName, userRole }: { userName: string; userRole: Role }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-surface p-4 sm:w-64 sm:min-h-screen sm:border-b-0 sm:border-l">
      <Link href="/admin" className="text-lg font-extrabold gradient-text">
        {siteConfig.name}
      </Link>
      <p className="mt-1 text-xs text-muted">פאנל ניהול</p>

      <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="ניווט ניהול">
        {NAV_ITEMS.filter((item) => ROLE_RANK[userRole] >= ROLE_RANK[item.minRole]).map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                active ? "bg-cta text-white" : "text-muted hover:bg-white/5 hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-border pt-4">
        <p className="text-sm font-medium text-foreground">{userName}</p>
        <p className="text-xs text-muted">{ROLE_LABEL[userRole]}</p>
        <form action={logoutAction}>
          <button type="submit" className="mt-3 text-sm font-medium text-brand-pink hover:underline cursor-pointer">
            התנתקות
          </button>
        </form>
      </div>
    </aside>
  );
}

const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: "מנהל-על",
  EDITOR: "עורך תוכן",
  VIEWER: "צפייה בלבד",
};
