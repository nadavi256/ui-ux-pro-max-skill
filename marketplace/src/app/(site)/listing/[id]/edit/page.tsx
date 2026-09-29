import { notFound } from "next/navigation";
import { ListingForm } from "@/components/ListingForm";
import { updateListingAction } from "@/lib/actions/listing-actions";
import { imageSrc } from "@/lib/format";
import { getCategories, getListing } from "@/lib/listings";
import { requireUser } from "@/lib/session";

export const metadata = { title: "עריכת מודעה", robots: { index: false } };

export default async function EditListingPage(props: PageProps<"/listing/[id]/edit">) {
  const { id } = await props.params;
  const user = await requireUser(`/listing/${id}/edit`);
  const [listing, categories] = await Promise.all([getListing(id), getCategories()]);
  if (!listing || (listing.sellerId !== user.id && user.role !== "ADMIN")) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">עריכת מודעה</h1>
      <ListingForm
        categories={categories}
        action={updateListingAction.bind(null, listing.id)}
        submitLabel="שמירת שינויים"
        initial={{
          title: listing.title,
          description: listing.description,
          price: listing.price,
          condition: listing.condition,
          city: listing.city,
          categoryId: listing.categoryId,
          images: listing.images.map((img) => ({ id: img.id, src: imageSrc(img) })),
        }}
      />
    </div>
  );
}
