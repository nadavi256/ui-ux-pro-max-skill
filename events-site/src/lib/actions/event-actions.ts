"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";
import { slugify } from "@/lib/slugify";

const eventSchema = z.object({
  title: z.string().min(3, "כותרת קצרה מדי"),
  description: z.string().min(10, "תיאור קצר מדי"),
  coverImageUrl: z.url("כתובת תמונה לא תקינה"),
  startDate: z.string().min(1, "יש לבחור תאריך התחלה"),
  endDate: z.string().optional(),
  venueName: z.string().min(1, "שם המקום נדרש"),
  city: z.string().min(1, "עיר נדרשת"),
  address: z.string().optional(),
  priceLabel: z.string().optional(),
  affiliateUrl: z.url("כתובת שותף לא תקינה"),
  affiliateNetwork: z.string().optional(),
  categoryId: z.string().min(1, "יש לבחור קטגוריה"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  featured: z.coerce.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

export interface EventFormState {
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

async function uniqueSlugFor(title: string, excludeId?: string) {
  const base = slugify(title) || "event";
  let candidate = base;
  let suffix = 1;

  while (true) {
    const existing = await prisma.event.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }
}

function parseFormData(formData: FormData) {
  return eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    coverImageUrl: formData.get("coverImageUrl"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    venueName: formData.get("venueName"),
    city: formData.get("city"),
    address: formData.get("address") || undefined,
    priceLabel: formData.get("priceLabel") || undefined,
    affiliateUrl: formData.get("affiliateUrl"),
    affiliateNetwork: formData.get("affiliateNetwork") || undefined,
    categoryId: formData.get("categoryId"),
    status: formData.get("status"),
    featured: formData.get("featured") === "on",
    metaTitle: formData.get("metaTitle") || undefined,
    metaDescription: formData.get("metaDescription") || undefined,
  });
}

export async function createEventAction(_prevState: EventFormState, formData: FormData): Promise<EventFormState> {
  const user = await requireRole("EDITOR");
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { startDate, endDate, ...data } = parsed.data;
  const slug = await uniqueSlugFor(data.title);

  await prisma.event.create({
    data: {
      ...data,
      slug,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      createdById: user.id,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  redirect("/admin/events");
}

export async function updateEventAction(
  id: string,
  _prevState: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  await requireRole("EDITOR");
  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) return { error: "האירוע לא נמצא." };

  const { startDate, endDate, ...data } = parsed.data;
  const slug = data.title === existing.title ? existing.slug : await uniqueSlugFor(data.title, id);

  await prisma.event.update({
    where: { id },
    data: {
      ...data,
      slug,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/events/${slug}`);
  redirect("/admin/events");
}

export async function deleteEventAction(formData: FormData) {
  await requireRole("EDITOR");
  const id = formData.get("id");
  if (typeof id !== "string") return;

  await prisma.event.delete({ where: { id } });
  revalidatePath("/admin/events");
  revalidatePath("/events");
}
