import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function EmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-primary-soft text-primary">
        <Icon className="size-7" aria-hidden />
      </span>
      <h2 className="mt-4 text-lg font-bold">{title}</h2>
      {text && <p className="mt-1 max-w-sm text-muted-foreground">{text}</p>}
      {action && (
        <Link
          href={action.href}
          className="mt-5 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-hover"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
