"use client";

import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { Field, inputClass } from "@/components/Field";
import { SubmitButton } from "@/components/SubmitButton";
import type { Category, Condition } from "@/generated/prisma/client";
import type { FormState } from "@/lib/actions/auth-actions";
import { compressImage } from "@/lib/compress-image";
import { CITIES, CONDITION_LABELS, CONDITIONS, MAX_IMAGES } from "@/lib/constants";

type Photo = { key: string; preview: string } & ({ kind: "existing"; id: string } | { kind: "new"; file: File });

export interface ListingFormValues {
  title: string;
  description: string;
  price: number;
  condition: Condition;
  city: string;
  categoryId: string;
  images: { id: string; src: string }[];
}

export function ListingForm({
  categories,
  action,
  initial,
  defaultCity,
  submitLabel,
}: {
  categories: Category[];
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  initial?: ListingFormValues;
  defaultCity?: string | null;
  submitLabel: string;
}) {
  const [photos, setPhotos] = useState<Photo[]>(
    () => initial?.images.map((img) => ({ key: img.id, kind: "existing", id: img.id, preview: img.src })) ?? [],
  );
  const [processing, setProcessing] = useState(false);
  const [photoError, setPhotoError] = useState<string>();
  const [free, setFree] = useState(initial?.price === 0);
  const fileInput = useRef<HTMLInputElement>(null);

  // Wrap the server action so compressed photos (held in state, not in the
  // file input) are appended to the submitted FormData.
  const [state, formAction, pending] = useActionState(async (prev: FormState, formData: FormData) => {
    formData.delete("images");
    for (const photo of photos) {
      if (photo.kind === "existing") formData.append("keepImage", photo.id);
      else formData.append("images", photo.file);
    }
    if (free) formData.set("price", "0");
    return action(prev, formData);
  }, {});

  useEffect(
    () => () => photos.forEach((p) => p.kind === "new" && URL.revokeObjectURL(p.preview)),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- revoke only on unmount
    [],
  );

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    setPhotoError(undefined);
    const room = MAX_IMAGES - photos.length;
    if (files.length > room) setPhotoError(`אפשר להעלות עד ${MAX_IMAGES} תמונות`);
    setProcessing(true);
    try {
      const added: Photo[] = [];
      for (const file of Array.from(files).slice(0, room)) {
        if (!file.type.startsWith("image/")) continue;
        const compressed = await compressImage(file);
        added.push({
          key: crypto.randomUUID(),
          kind: "new",
          file: compressed,
          preview: URL.createObjectURL(compressed),
        });
      }
      setPhotos((prev) => [...prev, ...added]);
    } catch {
      setPhotoError("לא הצלחנו לעבד את אחת התמונות. נסו תמונה אחרת.");
    } finally {
      setProcessing(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  function removePhoto(key: string) {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.key === key);
      if (photo?.kind === "new") URL.revokeObjectURL(photo.preview);
      return prev.filter((p) => p.key !== key);
    });
  }

  function makeCover(key: string) {
    setPhotos((prev) => [...prev.filter((p) => p.key === key), ...prev.filter((p) => p.key !== key)]);
  }

  const err = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      <section className="rounded-2xl border border-border bg-card p-5">
        <h2 className="text-base font-bold">תמונות</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          עד {MAX_IMAGES} תמונות. הראשונה תוצג כתמונה הראשית — לחצו על תמונה כדי להפוך אותה לראשית.
        </p>
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {photos.map((photo, i) => (
            <li key={photo.key} className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
              <button
                type="button"
                onClick={() => makeCover(photo.key)}
                aria-label={i === 0 ? "תמונה ראשית" : `הפיכת תמונה ${i + 1} לראשית`}
                className="size-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview */}
                <img src={photo.preview} alt="" className="size-full object-cover" />
              </button>
              {i === 0 && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-primary/90 py-0.5 text-center text-[11px] font-semibold text-primary-foreground">
                  ראשית
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(photo.key)}
                aria-label={`הסרת תמונה ${i + 1}`}
                className="absolute top-1 left-1 grid size-7 place-items-center rounded-full bg-foreground/70 text-white hover:bg-foreground"
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
          {photos.length < MAX_IMAGES && (
            <li className="aspect-square">
              <label
                htmlFor="photos"
                className="flex size-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-primary/40 bg-primary-soft/50 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary-soft"
              >
                {processing ? (
                  <LoaderCircle className="size-6 animate-spin" aria-hidden />
                ) : (
                  <ImagePlus className="size-6" aria-hidden />
                )}
                {processing ? "מעבד…" : "הוספה"}
              </label>
              <input
                ref={fileInput}
                id="photos"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => addFiles(e.target.files)}
              />
            </li>
          )}
        </ul>
        {(photoError || err.images) && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            {photoError ?? err.images}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5">
        <h2 className="text-base font-bold">פרטי המודעה</h2>

        <Field id="title" label="מה מוכרים?" error={err.title}>
          <input
            id="title"
            name="title"
            required
            maxLength={80}
            defaultValue={initial?.title}
            placeholder="לדוגמה: ספה תלת-מושבית אפורה"
            aria-invalid={!!err.title}
            className={inputClass}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="categoryId" label="קטגוריה" error={err.categoryId}>
            <select
              id="categoryId"
              name="categoryId"
              required
              defaultValue={initial?.categoryId ?? ""}
              aria-invalid={!!err.categoryId}
              className={inputClass}
            >
              <option value="" disabled>
                בחרו קטגוריה
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>

          <Field id="condition" label="מצב" error={err.condition}>
            <select
              id="condition"
              name="condition"
              defaultValue={initial?.condition ?? "USED"}
              className={inputClass}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>
                  {CONDITION_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field id="description" label="תיאור" error={err.description} hint="מידות, גיל הפריט, סיבת מכירה, איסוף/משלוח">
          <textarea
            id="description"
            name="description"
            required
            rows={5}
            maxLength={4000}
            defaultValue={initial?.description}
            aria-invalid={!!err.description}
            className={`${inputClass} h-auto py-3 leading-relaxed`}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="price" label="מחיר (₪)" error={err.price}>
            <input
              id="price"
              name="price"
              type="number"
              inputMode="numeric"
              min={0}
              required={!free}
              disabled={free}
              defaultValue={initial && initial.price > 0 ? initial.price : undefined}
              placeholder={free ? "למסירה" : "0"}
              aria-invalid={!!err.price}
              className={`${inputClass} disabled:bg-muted`}
            />
            <label className="flex items-center gap-2 pt-1 text-sm">
              <input
                type="checkbox"
                checked={free}
                onChange={(e) => setFree(e.target.checked)}
                className="size-4 accent-[var(--cta)]"
              />
              למסירה בחינם
            </label>
          </Field>

          <Field id="city" label="עיר" error={err.city}>
            <select
              id="city"
              name="city"
              required
              defaultValue={initial?.city ?? defaultCity ?? ""}
              aria-invalid={!!err.city}
              className={inputClass}
            >
              <option value="" disabled>
                בחרו עיר
              </option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {state.error && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </p>
      )}

      <SubmitButton pending={pending || processing} variant="cta" className="w-full sm:w-auto sm:self-start sm:px-10">
        {submitLabel}
      </SubmitButton>
    </form>
  );
}
