"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { CITIES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { FormState } from "@/lib/actions/auth-actions";

const profileSchema = z.object({
  name: z.string().trim().min(2, "נא להזין שם").max(60),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{1,2}-?\d{7}$/, "מספר טלפון לא תקין")
    .or(z.literal("")),
  city: z.enum(CITIES).or(z.literal("")),
});

export async function updateProfileAction(_prev: FormState, formData: FormData): Promise<FormState & { ok?: boolean }> {
  const user = await requireUser("/me/profile");
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { fieldErrors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])) };
  }
  const { name, phone, city } = parsed.data;
  await prisma.user.update({ where: { id: user.id }, data: { name, phone: phone || null, city: city || null } });
  revalidatePath("/me");
  return { ok: true };
}
