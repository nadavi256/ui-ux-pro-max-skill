import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Optimistic-only auth check (cookie-based), safe to run on every request.
// The real role check for each /admin page happens server-side via auth()
// in src/lib/require-role.ts — see AUTHENTICATION.md / README for details.
const { auth } = NextAuth(authConfig);
export const proxy = auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
