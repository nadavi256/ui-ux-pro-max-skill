"use client";

import { useActionState } from "react";
import type { EventFormState } from "@/lib/actions/event-actions";

interface Category {
  id: string;
  name: string;
}

export interface EventFormDefaults {
  title: string;
  description: string;
  coverImageUrl: string;
  startDate: string;
  endDate: string;
  venueName: string;
  city: string;
  address: string;
  priceLabel: string;
  affiliateUrl: string;
  affiliateNetwork: string;
  categoryId: string;
  status: string;
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
}

const emptyDefaults: EventFormDefaults = {
  title: "",
  description: "",
  coverImageUrl: "",
  startDate: "",
  endDate: "",
  venueName: "",
  city: "",
  address: "",
  priceLabel: "",
  affiliateUrl: "",
  affiliateNetwork: "",
  categoryId: "",
  status: "DRAFT",
  featured: false,
  metaTitle: "",
  metaDescription: "",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none";

export function EventForm({
  action,
  categories,
  defaults = emptyDefaults,
  submitLabel,
}: {
  action: (state: EventFormState, formData: FormData) => Promise<EventFormState>;
  categories: Category[];
  defaults?: EventFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-5">
      {state.error && <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">{state.error}</p>}

      <Field label="כותרת האירוע">
        <input name="title" required defaultValue={defaults.title} className={inputClass} />
        {state.fieldErrors?.title && <p className="text-xs text-red-400">{state.fieldErrors.title[0]}</p>}
      </Field>

      <Field label="תיאור">
        <textarea name="description" required rows={5} defaultValue={defaults.description} className={inputClass} />
        {state.fieldErrors?.description && <p className="text-xs text-red-400">{state.fieldErrors.description[0]}</p>}
      </Field>

      <Field label="כתובת תמונת שער (URL)">
        <input name="coverImageUrl" required type="url" defaultValue={defaults.coverImageUrl} className={inputClass} />
        {state.fieldErrors?.coverImageUrl && (
          <p className="text-xs text-red-400">{state.fieldErrors.coverImageUrl[0]}</p>
        )}
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="תאריך ושעת התחלה">
          <input
            name="startDate"
            required
            type="datetime-local"
            defaultValue={defaults.startDate}
            className={inputClass}
          />
        </Field>
        <Field label="תאריך ושעת סיום (אופציונלי)">
          <input name="endDate" type="datetime-local" defaultValue={defaults.endDate} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="שם המקום / האולם">
          <input name="venueName" required defaultValue={defaults.venueName} className={inputClass} />
        </Field>
        <Field label="עיר">
          <input name="city" required defaultValue={defaults.city} className={inputClass} />
        </Field>
      </div>

      <Field label="כתובת מדויקת (אופציונלי)">
        <input name="address" defaultValue={defaults.address} className={inputClass} />
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="תווית מחיר (טקסט חופשי)">
          <input name="priceLabel" placeholder='לדוגמה: מ-90 ש"ח' defaultValue={defaults.priceLabel} className={inputClass} />
        </Field>
        <Field label="שם רשת השותפים (אופציונלי)">
          <input name="affiliateNetwork" defaultValue={defaults.affiliateNetwork} className={inputClass} />
        </Field>
      </div>

      <Field label="קישור שותף חיצוני (לרכישת כרטיסים)">
        <input name="affiliateUrl" required type="url" defaultValue={defaults.affiliateUrl} className={inputClass} />
        {state.fieldErrors?.affiliateUrl && <p className="text-xs text-red-400">{state.fieldErrors.affiliateUrl[0]}</p>}
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="קטגוריה">
          <select name="categoryId" required defaultValue={defaults.categoryId} className={inputClass}>
            <option value="" disabled>
              בחרו קטגוריה
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="סטטוס">
          <select name="status" defaultValue={defaults.status} className={inputClass}>
            <option value="DRAFT">טיוטה</option>
            <option value="PUBLISHED">פורסם</option>
            <option value="ARCHIVED">בארכיון</option>
          </select>
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input type="checkbox" name="featured" defaultChecked={defaults.featured} className="h-4 w-4 cursor-pointer" />
        סמנו כאירוע מומלץ (יוצג בדף הבית)
      </label>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="כותרת SEO (אופציונלי)">
          <input name="metaTitle" defaultValue={defaults.metaTitle} className={inputClass} />
        </Field>
        <Field label="תיאור SEO (אופציונלי)">
          <input name="metaDescription" defaultValue={defaults.metaDescription} className={inputClass} />
        </Field>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-fit rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-50 cursor-pointer"
      >
        {pending ? "שומר..." : submitLabel}
      </button>
    </form>
  );
}
