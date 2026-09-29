"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { CITIES, CONDITIONS, MAX_IMAGE_BYTES, MAX_IMAGES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, requireUser } from "@/lib/session";
import type { FormState } from "@/lib/actions/auth-actions";

const ALLOWED_MIME = ["image/webp", "image/jpeg", "image/png"];

const listingSchema = z.object({
  title: z.string().trim().min(3, "כותרת קצרה מדי").max(80, "עד 80 תווים"),
  description: z.string().trim().min(10, "ספרו קצת יותר על הפריט (לפחות 10 תווים)").max(4000),
  price: z.coerce.number().int("מחיר בשקלים שלמים").min(0, "מחיר לא תקין").max(10_000_000),
  condition: z.enum(CONDITIONS),
  city: z.enum(CITIES, "נא לבחור עיר"),
  categoryId: z.string().min(1, "נא לבחור קטגוריה"),
});

function fieldErrors(error: z.ZodError) {
  return Object.fromEntries(error.issues.map((i) => [String(i.path[0]), i.message]));
}

async function readImages(formData: FormData) {
  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of files) {
    if (!ALLOWED_MIME.includes(file.type)) return { error: "ניתן להעלות תמונות JPG, PNG או WebP בלבד" };
    if (file.size > MAX_IMAGE_BYTES) return { error: "אחת התמונות גדולה מדי" };
  }
  return {
    images: await Promise.all(
      files.map(async (file) => ({ data: new Uint8Array(await file.arrayBuffer()), mime: file.type })),
    ),
  };
}

export async function createListingAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser("/post");

  const parsed = listingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const uploaded = await readImages(formData);
  if ("error" in uploaded) return { error: uploaded.error };
  if (uploaded.images.length === 0) return { fieldErrors: { images: "הוסיפו לפחות תמונה אחת" } };
  if (uploaded.images.length > MAX_IMAGES) return { fieldErrors: { images: `עד ${MAX_IMAGES} תמונות` } };

  const listing = await prisma.listing.create({
    data: {
      ...parsed.data,
      sellerId: user.id,
      images: { create: uploaded.images.map((img, order) => ({ ...img, order })) },
    },
  });

  revalidatePath("/");
  redirect(`/listing/${listing.id}?posted=1`);
}

export async function updateListingAction(
  listingId: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await requireUser();
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { sellerId: true, _count: { select: { images: true } } },
  });
  if (!listing || (listing.sellerId !== user.id && user.role !== "ADMIN")) return { error: "אין הרשאה" };

  const parsed = listingSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };

  const keepIds = formData.getAll("keepImage").map(String);
  const uploaded = await readImages(formData);
  if ("error" in uploaded) return { error: uploaded.error };
  const total = keepIds.length + uploaded.images.length;
  if (total === 0) return { fieldErrors: { images: "הוסיפו לפחות תמונה אחת" } };
  if (total > MAX_IMAGES) return { fieldErrors: { images: `עד ${MAX_IMAGES} תמונות` } };

  await prisma.$transaction([
    prisma.listingImage.deleteMany({ where: { listingId, id: { notIn: keepIds } } }),
    ...keepIds.map((id, order) =>
      prisma.listingImage.updateMany({ where: { id, listingId }, data: { order } }),
    ),
    prisma.listing.update({
      where: { id: listingId },
      data: {
        ...parsed.data,
        images: {
          create: uploaded.images.map((img, i) => ({ ...img, order: keepIds.length + i })),
        },
      },
    }),
  ]);

  revalidatePath(`/listing/${listingId}`);
  redirect(`/listing/${listingId}`);
}

async function assertOwner(listingId: string) {
  const user = await requireUser();
  const listing = await prisma.listing.findUnique({ where: { id: listingId }, select: { sellerId: true } });
  if (!listing || (listing.sellerId !== user.id && user.role !== "ADMIN")) {
    throw new Error("Not allowed");
  }
}

export async function setListingStatusAction(listingId: string, status: "ACTIVE" | "SOLD" | "HIDDEN") {
  await assertOwner(listingId);
  await prisma.listing.update({ where: { id: listingId }, data: { status } });
  revalidatePath(`/listing/${listingId}`);
  revalidatePath("/me");
}

export async function deleteListingAction(listingId: string) {
  await assertOwner(listingId);
  await prisma.listing.delete({ where: { id: listingId } });
  revalidatePath("/me");
  redirect("/me?deleted=1");
}

export async function toggleFavoriteAction(listingId: string): Promise<{ favorited: boolean } | { error: "auth" }> {
  const user = await getCurrentUser();
  if (!user) return { error: "auth" };

  const key = { userId_listingId: { userId: user.id, listingId } };
  const existing = await prisma.favorite.findUnique({ where: key });
  if (existing) {
    await prisma.favorite.delete({ where: key });
  } else {
    await prisma.favorite.create({ data: { userId: user.id, listingId } });
  }
  revalidatePath("/favorites");
  return { favorited: !existing };
}
