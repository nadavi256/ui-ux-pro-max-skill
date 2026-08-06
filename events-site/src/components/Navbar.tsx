"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const links = [
  { href: "/", label: "בית" },
  { href: "/events", label: "אירועים קרובים" },
  { href: "/tzafon", label: "צפון" },
  { href: "/merkaz", label: "מרכז" },
  { href: "/darom", label: "דרום" },
  { href: "/hofaot", label: "הופעות" },
  { href: "/about", label: "אודות" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="text-xl font-black tracking-tight text-primary">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="ניווט ראשי">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground ${
                pathname === l.href ? "bg-secondary text-foreground" : "text-muted-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/login"
            className="hidden items-center gap-1 rounded-md border border-border/60 px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary sm:inline-flex"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" /> כניסת מנהלים
          </Link>
          <button
            type="button"
            className="rounded-md p-2 text-foreground hover:bg-secondary lg:hidden cursor-pointer"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background lg:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col p-2" aria-label="ניווט נייד">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-3 text-sm font-medium ${
                  pathname === l.href ? "bg-secondary text-foreground" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-2 rounded-md px-3 py-3 text-sm font-medium text-foreground"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" /> כניסת מנהלים
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
