"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  if (count === 0) return <div className="aspect-[4/3] rounded-2xl bg-muted" />;

  const go = (delta: number) => setIndex((i) => (i + delta + count) % count);

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
        role="region"
        aria-roledescription="גלריה"
        aria-label={`תמונות של ${title}`}
      >
        <Image
          src={images[index]}
          alt={`${title} — תמונה ${index + 1} מתוך ${count}`}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-contain"
        />
        {count > 1 && (
          <>
            {/* RTL: "previous" sits on the right */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="התמונה הקודמת"
              className="absolute top-1/2 right-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-card/90 shadow transition-colors duration-200 hover:bg-card"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="התמונה הבאה"
              className="absolute top-1/2 left-3 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-card/90 shadow transition-colors duration-200 hover:bg-card"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <span className="absolute bottom-3 left-3 rounded-full bg-foreground/70 px-2.5 py-0.5 text-xs font-medium text-white">
              {index + 1}/{count}
            </span>
          </>
        )}
      </div>
      {count > 1 && (
        <ul className="scrollbar-none flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`תמונה ${i + 1}`}
                aria-current={i === index}
                className={`relative block size-16 overflow-hidden rounded-lg border-2 transition-colors duration-200 ${i === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <Image src={src} alt="" fill sizes="64px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
