"use client";

import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import { contactSellerAction } from "@/lib/actions/message-actions";
import { toIntlPhone } from "@/lib/format";

export function ContactPanel({
  listingId,
  listingTitle,
  phone,
  signedIn,
}: {
  listingId: string;
  listingTitle: string;
  phone: string | null;
  signedIn: boolean;
}) {
  const [showPhone, setShowPhone] = useState(false);
  const [state, action, pending] = useActionState(contactSellerAction.bind(null, listingId), {});

  return (
    <div className="flex flex-col gap-3">
      {phone &&
        (showPhone ? (
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:+${toIntlPhone(phone)}`}
              className="flex h-12 items-center justify-center gap-2 rounded-xl bg-cta font-semibold text-cta-foreground transition-colors duration-200 hover:bg-cta-hover"
            >
              <Phone className="size-5" aria-hidden />
              <span dir="ltr">{phone}</span>
            </a>
            <a
              href={`https://wa.me/${toIntlPhone(phone)}?text=${encodeURIComponent(`היי, ראיתי את המודעה "${listingTitle}". היא עדיין רלוונטית?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-cta font-semibold text-cta transition-colors duration-200 hover:bg-cta/5"
            >
              <MessageCircle className="size-5" aria-hidden />
              וואטסאפ
            </a>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowPhone(true)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-cta font-semibold text-cta-foreground transition-colors duration-200 hover:bg-cta-hover"
          >
            <Phone className="size-5" aria-hidden />
            הצגת מספר טלפון
          </button>
        ))}

      {signedIn ? (
        <form action={action} className="flex flex-col gap-2">
          <label htmlFor="contact-body" className="text-sm font-semibold">
            שליחת הודעה למוכר/ת
          </label>
          <textarea
            id="contact-body"
            name="body"
            rows={3}
            required
            maxLength={2000}
            defaultValue="היי, הפריט עדיין זמין?"
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-base focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
          />
          {state.error && (
            <p role="alert" className="text-sm text-destructive">
              {state.error}
            </p>
          )}
          <SubmitButton pending={pending}>שליחת הודעה</SubmitButton>
        </form>
      ) : (
        <Link
          href={`/login?callbackUrl=${encodeURIComponent(`/listing/${listingId}`)}`}
          className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-colors duration-200 hover:bg-primary-hover"
        >
          <MessageCircle className="size-5" aria-hidden />
          התחברו כדי לשלוח הודעה
        </Link>
      )}
    </div>
  );
}
