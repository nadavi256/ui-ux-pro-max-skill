"use client";

import { useActionState, useRef } from "react";
import { createCategoryAction } from "@/lib/actions/category-actions";

export function CategoryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(async (prev: { error?: string }, formData: FormData) => {
    const result = await createCategoryAction(prev, formData);
    if (!result.error) formRef.current?.reset();
    return result;
  }, {});

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-muted">שם הקטגוריה</span>
        <input
          name="name"
          required
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-pink focus:outline-none"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full gradient-bg px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50 cursor-pointer"
      >
        {pending ? "מוסיף..." : "הוספת קטגוריה"}
      </button>
    </form>
  );
}
