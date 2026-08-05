"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";
import { slugify } from "@/lib/slugify";

const categorySchema = z.object({
  name: z.string().min(2, "שם קצר מדי"),
  icon: z.string().optional(),
});

export interface CategoryFormState {
  error?: string;
}

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  await requireRole("EDITOR");

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    icon: formData.get("icon") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  const baseSlug = slugify(parsed.data.name) || "category";
  let slug = baseSlug;
  let suffix = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }

  await prisma.category.create({
    data: { name: parsed.data.name, icon: parsed.data.icon, slug },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/events");
  return {};
}

export async function deleteCategoryAction(formData: FormData) {
  await requireRole("EDITOR");
  const id = formData.get("id");
  if (typeof id !== "string") return;

  const eventCount = await prisma.event.count({ where: { categoryId: id } });
  if (eventCount > 0) {
    throw new Error("לא ניתן למחוק קטגוריה שיש בה אירועים. יש להעביר או למחוק את האירועים תחילה.");
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
}
