"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { safeRedirectPath } from "@/lib/safe-redirect";

export interface FormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: safeRedirectPath(formData.get("callbackUrl")),
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) return { error: "אימייל או סיסמה שגויים." };
    throw error;
  }
}

const registerSchema = z.object({
  name: z.string().trim().min(2, "נא להזין שם (לפחות 2 תווים)").max(60),
  email: z.email("כתובת אימייל לא תקינה").transform((v) => v.toLowerCase()),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{1,2}-?\d{7}$/, "מספר טלפון לא תקין (לדוגמה 050-1234567)")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  password: z.string().min(8, "סיסמה חייבת להכיל לפחות 8 תווים"),
});

export async function registerAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      fieldErrors: Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])),
    };
  }

  const { name, email, phone, password } = parsed.data;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { fieldErrors: { email: "כבר קיים חשבון עם האימייל הזה" } };

  await prisma.user.create({
    data: { name, email, phone, passwordHash: await bcrypt.hash(password, 10) },
  });

  try {
    await signIn("credentials", { email, password, redirectTo: safeRedirectPath(formData.get("callbackUrl")) });
  } catch (error) {
    if (error instanceof AuthError) return { error: "החשבון נוצר, אבל ההתחברות נכשלה. נסו להתחבר." };
    throw error;
  }
  return {};
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}
