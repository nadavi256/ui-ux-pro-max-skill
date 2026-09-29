"use client";

import { CircleCheck, Eye, EyeOff, Pencil, RotateCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import type { ListingStatus } from "@/generated/prisma/client";
import { deleteListingAction, setListingStatusAction } from "@/lib/actions/listing-actions";

const btn =
  "flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold transition-colors duration-200 hover:bg-muted disabled:opacity-60";

export function OwnerActions({ listingId, status }: { listingId: string; status: ListingStatus }) {
  const [pending, start] = useTransition();
  const setStatus = (s: ListingStatus) => start(() => setListingStatusAction(listingId, s));

  return (
    <div className="grid grid-cols-2 gap-2">
      <Link href={`/listing/${listingId}/edit`} className={btn}>
        <Pencil className="size-4" aria-hidden />
        עריכה
      </Link>
      {status === "ACTIVE" ? (
        <button type="button" disabled={pending} onClick={() => setStatus("SOLD")} className={btn}>
          <CircleCheck className="size-4" aria-hidden />
          סימון כנמכר
        </button>
      ) : (
        <button type="button" disabled={pending} onClick={() => setStatus("ACTIVE")} className={btn}>
          <RotateCcw className="size-4" aria-hidden />
          החזרה לפרסום
        </button>
      )}
      {status === "HIDDEN" ? (
        <button type="button" disabled={pending} onClick={() => setStatus("ACTIVE")} className={btn}>
          <Eye className="size-4" aria-hidden />
          הצגה
        </button>
      ) : (
        <button type="button" disabled={pending} onClick={() => setStatus("HIDDEN")} className={btn}>
          <EyeOff className="size-4" aria-hidden />
          הסתרה
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("למחוק את המודעה לצמיתות?")) start(() => deleteListingAction(listingId));
        }}
        className={`${btn} text-destructive hover:bg-destructive/5`}
      >
        <Trash2 className="size-4" aria-hidden />
        מחיקה
      </button>
    </div>
  );
}
