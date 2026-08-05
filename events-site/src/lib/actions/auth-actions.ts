"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "אימייל או סיסמה שגויים." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
