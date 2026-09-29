import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Optimistic cookie-based check that bounces signed-out visitors from
// private pages to /login. Every page/action still verifies the session
// server-side via requireUser() in src/lib/session.ts.
const { auth } = NextAuth(authConfig);
export const proxy = auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
