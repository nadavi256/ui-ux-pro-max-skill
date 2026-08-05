"use client";

import Link from "next/link";
import { useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-foreground hover:bg-white/5 cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-border bg-background/98 p-4 shadow-2xl">
          <nav className="flex flex-col gap-1" aria-label="ניווט נייד">
            <Link
              href="/events"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-white/5"
            >
              כל האירועים
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-muted hover:bg-white/5 hover:text-foreground"
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
