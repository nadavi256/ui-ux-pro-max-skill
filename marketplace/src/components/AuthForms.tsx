"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field, inputClass } from "@/components/Field";
import { SubmitButton } from "@/components/SubmitButton";
import { loginAction, registerAction } from "@/lib/actions/auth-actions";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, action, pending] = useActionState(loginAction, {});
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/"} />
      <Field id="email" label="אימייל">
        <input id="email" name="email" type="email" required autoComplete="email" dir="ltr" className={inputClass} />
      </Field>
      <Field id="password" label="סיסמה">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          dir="ltr"
          className={inputClass}
        />
      </Field>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <SubmitButton pending={pending}>התחברות</SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        אין לכם חשבון?{" "}
        <Link
          href={callbackUrl ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/register"}
          className="font-semibold text-primary hover:underline"
        >
          הרשמה
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, action, pending] = useActionState(registerAction, {});
  const err = state.fieldErrors ?? {};
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/"} />
      <Field id="name" label="שם" error={err.name}>
        <input id="name" name="name" required autoComplete="name" aria-invalid={!!err.name} className={inputClass} />
      </Field>
      <Field id="email" label="אימייל" error={err.email}>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          dir="ltr"
          aria-invalid={!!err.email}
          className={inputClass}
        />
      </Field>
      <Field id="phone" label="טלפון (לא חובה)" error={err.phone} hint="יוצג לקונים רק כשהם לוחצים על 'הצגת מספר'">
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          dir="ltr"
          placeholder="050-1234567"
          aria-invalid={!!err.phone}
          className={inputClass}
        />
      </Field>
      <Field id="password" label="סיסמה" error={err.password} hint="לפחות 8 תווים">
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          dir="ltr"
          aria-invalid={!!err.password}
          className={inputClass}
        />
      </Field>
      {state.error && (
        <p role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <SubmitButton pending={pending} variant="cta">
        יצירת חשבון
      </SubmitButton>
      <p className="text-center text-sm text-muted-foreground">
        כבר רשומים?{" "}
        <Link
          href={callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login"}
          className="font-semibold text-primary hover:underline"
        >
          התחברות
        </Link>
      </p>
    </form>
  );
}
