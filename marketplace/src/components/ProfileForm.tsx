"use client";

import { useActionState } from "react";
import { Field, inputClass } from "@/components/Field";
import { SubmitButton } from "@/components/SubmitButton";
import { updateProfileAction } from "@/lib/actions/profile-actions";
import { CITIES } from "@/lib/constants";

export function ProfileForm({ user }: { user: { name: string; phone: string | null; city: string | null } }) {
  const [state, action, pending] = useActionState(updateProfileAction, {});
  const err = state.fieldErrors ?? {};

  return (
    <form action={action} className="flex flex-col gap-4">
      <Field id="name" label="שם" error={err.name}>
        <input id="name" name="name" required defaultValue={user.name} className={inputClass} />
      </Field>
      <Field id="phone" label="טלפון" error={err.phone} hint="יוצג לקונים רק בלחיצה על 'הצגת מספר'">
        <input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          dir="ltr"
          placeholder="050-1234567"
          defaultValue={user.phone ?? ""}
          className={inputClass}
        />
      </Field>
      <Field id="city" label="עיר ברירת מחדל למודעות" error={err.city}>
        <select id="city" name="city" defaultValue={user.city ?? ""} className={inputClass}>
          <option value="">—</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      {state.ok && (
        <p role="status" className="text-sm font-medium text-cta">
          הפרטים נשמרו.
        </p>
      )}
      <SubmitButton pending={pending}>שמירה</SubmitButton>
    </form>
  );
}
