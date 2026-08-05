"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth-actions";
import { siteConfig } from "@/lib/site-config";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8">
        <p className="text-center text-xl font-extrabold gradient-text">{siteConfig.name}</p>
        <h1 className="mt-2 text-center text-lg font-semibold text-foreground">כניסת מנהלים</h1>

        <form action={action} className="mt-6 flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-muted">
              אימייל
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-pink focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-muted">
              סיסמה
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-pink focus:outline-none"
            />
          </div>

          {state.error && <p className="text-sm text-red-400">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 flex items-center justify-center rounded-full gradient-bg px-6 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
          >
            {pending ? "מתחבר..." : "התחברות"}
          </button>
        </form>
      </div>
    </div>
  );
}
