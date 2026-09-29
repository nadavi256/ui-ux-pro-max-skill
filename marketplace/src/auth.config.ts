import type { NextAuthConfig } from "next-auth";

// Routes that require a signed-in user. Prefix match.
const PROTECTED_PREFIXES = ["/post", "/me", "/favorites", "/messages"];

// Edge-safe auth config: no Prisma / Node-only imports here.
// Shared by auth.ts (Node) and proxy.ts (optimistic cookie check only).
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      const needsAuth =
        PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)) ||
        /^\/listing\/[^/]+\/edit$/.test(pathname);
      return needsAuth ? !!auth?.user : true;
    },
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
