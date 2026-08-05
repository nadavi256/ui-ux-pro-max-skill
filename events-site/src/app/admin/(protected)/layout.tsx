import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireRole } from "@/lib/require-role";

export default async function ProtectedAdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireRole("VIEWER");

  return (
    <div className="flex flex-col sm:flex-row">
      <AdminSidebar userName={user.name ?? user.email ?? ""} userRole={user.role} />
      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
