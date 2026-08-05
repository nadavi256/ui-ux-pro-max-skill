import type { NextAuthConfig } from "next-auth";

// Edge-safe auth config: no Prisma / Node-only imports here.
// Used both by the full auth.ts (Node runtime) and by proxy.ts (optimistic
// checks only) so it must not touch the database.
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isLoginPage = request.nextUrl.pathname === "/admin/login";

      if (isLoginPage) return true;
      if (isAdminRoute) return isLoggedIn;
      return true;
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
        session.user.role = token.role as "SUPER_ADMIN" | "EDITOR" | "VIEWER";
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
