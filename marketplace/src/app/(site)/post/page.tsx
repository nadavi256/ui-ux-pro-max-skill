import Link from "next/link";
import { ListingForm } from "@/components/ListingForm";
import { createListingAction } from "@/lib/actions/listing-actions";
import { getCategories } from "@/lib/listings";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const metadata = { title: "פרסום מודעה", robots: { index: false } };

export default async function PostPage() {
  const sessionUser = await requireUser("/post");
  const [categories, user] = await Promise.all([
    getCategories(),
    prisma.user.findUnique({ where: { id: sessionUser.id }, select: { city: true, phone: true } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold">פרסום מודעה חדשה</h1>
      <p className="mt-1 mb-6 text-muted-foreground">בחינם, בלי עמלות. מודעה עם תמונות טובות נמכרת מהר יותר.</p>
      {!user?.phone && (
        <p className="mb-6 rounded-xl bg-primary-soft px-4 py-3 text-sm">
          טיפ: <Link href="/me/profile" className="font-semibold text-primary underline">הוסיפו מספר טלפון</Link> לפרופיל
          כדי שקונים יוכלו להתקשר או לשלוח וואטסאפ.
        </p>
      )}
      <ListingForm
        categories={categories}
        action={createListingAction}
        defaultCity={user?.city}
        submitLabel="פרסום המודעה"
      />
    </div>
  );
}
