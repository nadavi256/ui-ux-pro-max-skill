"use client";

import { useActionState, useRef } from "react";
import { createUserAction } from "@/lib/actions/user-actions";

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none";

export function UserForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (prev: { error?: string }, formData: FormData) => {
    const result = await createUserAction(prev, formData);
    if (!result.error) formRef.current?.reset();
    return result;
  }, {});

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">שם מלא</span>
        <input name="name" required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">אימייל</span>
        <input name="email" type="email" required className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">סיסמה זמנית</span>
        <input name="password" type="password" required minLength={8} className={inputClass} />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">הרשאה</span>
        <select name="role" defaultValue="VIEWER" className={inputClass}>
          <option value="VIEWER">צפייה בלבד</option>
          <option value="EDITOR">עורך תוכן</option>
          <option value="SUPER_ADMIN">מנהל-על</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-50 cursor-pointer"
      >
        {pending ? "יוצר..." : "יצירת משתמש"}
      </button>
    </form>
  );
}
