"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/require-role";

const userSchema = z.object({
  name: z.string().min(2, "שם קצר מדי"),
  email: z.email("אימייל לא תקין"),
  password: z.string().min(8, "סיסמה חייבת להכיל לפחות 8 תווים"),
  role: z.enum(["SUPER_ADMIN", "EDITOR", "VIEWER"]),
});

export interface UserFormState {
  error?: string;
}

export async function createUserAction(_prevState: UserFormState, formData: FormData): Promise<UserFormState> {
  await requireRole("SUPER_ADMIN");

  const parsed = userSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "שגיאה בטופס" };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return { error: "כבר קיים משתמש עם אימייל זה." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      passwordHash,
    },
  });

  revalidatePath("/admin/users");
  return {};
}

export async function updateUserRoleAction(formData: FormData) {
  const actingUser = await requireRole("SUPER_ADMIN");
  const id = formData.get("id");
  const role = formData.get("role");
  if (typeof id !== "string" || typeof role !== "string") return;
  if (id === actingUser.id) {
    throw new Error("לא ניתן לשנות את ההרשאה של המשתמש המחובר כעת.");
  }

  await prisma.user.update({
    where: { id },
    data: { role: role as "SUPER_ADMIN" | "EDITOR" | "VIEWER" },
  });

  revalidatePath("/admin/users");
}

export async function deleteUserAction(formData: FormData) {
  const actingUser = await requireRole("SUPER_ADMIN");
  const id = formData.get("id");
  if (typeof id !== "string") return;
  if (id === actingUser.id) {
    throw new Error("לא ניתן למחוק את המשתמש המחובר כעת.");
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
