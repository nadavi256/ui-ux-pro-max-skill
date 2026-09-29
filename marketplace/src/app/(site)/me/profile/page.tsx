import { notFound } from "next/navigation";
import { ProfileForm } from "@/components/ProfileForm";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata = { title: "פרטים אישיים", robots: { index: false } };

export default async function ProfilePage() {
  const sessionUser = await requireUser("/me/profile");
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { name: true, email: true, phone: true, city: true },
  });
  if (!user) notFound();

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="text-2xl font-bold">פרטים אישיים</h1>
      <p className="mt-1 mb-6 text-muted-foreground" dir="ltr">
        {user.email}
      </p>
      <div className="rounded-2xl border border-border bg-card p-6">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
