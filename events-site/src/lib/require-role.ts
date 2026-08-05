import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import type { Role } from "@/generated/prisma/client";

const ROLE_RANK: Record<Role, number> = {
  VIEWER: 0,
  EDITOR: 1,
  SUPER_ADMIN: 2,
};

/**
 * Server-side authorization check (the real, non-optimistic check — see
 * proxy.ts for the cookie-only fast path). Redirects to login if there is
 * no session, and to the admin dashboard if the role is too low.
 */
export async function requireRole(minRole: Role) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  if (ROLE_RANK[session.user.role] < ROLE_RANK[minRole]) {
    redirect("/admin");
  }

  return session.user;
}
