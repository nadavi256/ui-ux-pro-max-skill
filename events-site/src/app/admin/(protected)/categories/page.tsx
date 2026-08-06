import { getCategories } from "@/lib/events";
import { requireRole } from "@/lib/require-role";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { deleteCategoryAction } from "@/lib/actions/category-actions";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  await requireRole("EDITOR");
  const categories = await getCategories();
  const eventCounts = await prisma.event.groupBy({ by: ["categoryId"], _count: true });
  const countByCategory = new Map(eventCounts.map((row) => [row.categoryId, row._count]));

  return (
    <div>
      <h1 className="text-2xl font-extrabold">קטגוריות</h1>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-card text-right text-muted-foreground">
                  <th className="px-4 py-3 font-medium">שם</th>
                  <th className="px-4 py-3 font-medium">כתובת (slug)</th>
                  <th className="px-4 py-3 font-medium">אירועים</th>
                  <th className="px-4 py-3 font-medium">פעולות</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{category.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">/{category.slug}</td>
                    <td className="px-4 py-3 text-muted-foreground">{countByCategory.get(category.id) ?? 0}</td>
                    <td className="px-4 py-3">
                      <form action={deleteCategoryAction}>
                        <input type="hidden" name="id" value={category.id} />
                        <DeleteButton confirmMessage={`למחוק את הקטגוריה "${category.name}"?`} />
                      </form>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                      אין עדיין קטגוריות.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-bold">קטגוריה חדשה</h2>
          <div className="mt-4">
            <CategoryForm />
          </div>
        </div>
      </div>
    </div>
  );
}
