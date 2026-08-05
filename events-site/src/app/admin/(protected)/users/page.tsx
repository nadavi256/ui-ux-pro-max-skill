import { requireRole } from "@/lib/require-role";
import { getAllUsers } from "@/lib/admin-data";
import { deleteUserAction, updateUserRoleAction } from "@/lib/actions/user-actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { UserForm } from "@/components/admin/UserForm";
import { RoleSelect } from "@/components/admin/RoleSelect";

const ROLE_LABEL: Record<string, string> = {
  SUPER_ADMIN: "מנהל-על",
  EDITOR: "עורך תוכן",
  VIEWER: "צפייה בלבד",
};

export default async function AdminUsersPage() {
  const currentUser = await requireRole("SUPER_ADMIN");
  const users = await getAllUsers();

  return (
    <div>
      <h1 className="text-2xl font-extrabold">משתמשים</h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-right text-muted">
                <th className="px-4 py-3 font-medium">שם</th>
                <th className="px-4 py-3 font-medium">אימייל</th>
                <th className="px-4 py-3 font-medium">הרשאה</th>
                <th className="px-4 py-3 font-medium">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {user.name} {user.id === currentUser.id && <span className="text-xs text-muted">(את/ה)</span>}
                  </td>
                  <td className="px-4 py-3 text-muted">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.id === currentUser.id ? (
                      ROLE_LABEL[user.role]
                    ) : (
                      <form action={updateUserRoleAction}>
                        <input type="hidden" name="id" value={user.id} />
                        <RoleSelect defaultValue={user.role} />
                      </form>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {user.id !== currentUser.id && (
                      <form action={deleteUserAction}>
                        <input type="hidden" name="id" value={user.id} />
                        <DeleteButton confirmMessage={`למחוק את המשתמש "${user.name}"?`} />
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="text-lg font-bold">משתמש חדש</h2>
          <div className="mt-4">
            <UserForm />
          </div>
        </div>
      </div>
    </div>
  );
}
