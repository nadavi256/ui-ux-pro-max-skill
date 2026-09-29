import { Tag } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2" aria-label={`${siteConfig.name} — דף הבית`}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
        <Tag className="size-5" aria-hidden />
      </span>
      <span className="text-xl font-extrabold tracking-tight text-foreground">{siteConfig.name}</span>
    </Link>
  );
}
