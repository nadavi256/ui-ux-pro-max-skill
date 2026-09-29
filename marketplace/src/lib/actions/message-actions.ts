"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { FormState } from "@/lib/actions/auth-actions";

const bodySchema = z.string().trim().min(1, "ההודעה ריקה").max(2000, "הודעה ארוכה מדי");

// Buyer contacts the seller: finds or creates the (listing, buyer)
// conversation and posts the first message.
export async function contactSellerAction(listingId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser(`/listing/${listingId}`);
  const body = bodySchema.safeParse(formData.get("body"));
  if (!body.success) return { error: body.error.issues[0].message };

  const listing = await prisma.listing.findUnique({ where: { id: listingId }, select: { sellerId: true } });
  if (!listing) return { error: "המודעה לא נמצאה" };
  if (listing.sellerId === user.id) return { error: "זו המודעה שלכם" };

  const conversation = await prisma.conversation.upsert({
    where: { listingId_buyerId: { listingId, buyerId: user.id } },
    create: { listingId, buyerId: user.id },
    update: {},
  });
  await prisma.message.create({ data: { conversationId: conversation.id, senderId: user.id, body: body.data } });
  await prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });

  redirect(`/messages/${conversation.id}`);
}

export async function sendMessageAction(conversationId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const body = bodySchema.safeParse(formData.get("body"));
  if (!body.success) return { error: body.error.issues[0].message };

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { buyerId: true, listing: { select: { sellerId: true } } },
  });
  if (!conversation || (conversation.buyerId !== user.id && conversation.listing.sellerId !== user.id)) {
    return { error: "אין הרשאה" };
  }

  await prisma.$transaction([
    prisma.message.create({ data: { conversationId, senderId: user.id, body: body.data } }),
    prisma.conversation.update({ where: { id: conversationId }, data: { updatedAt: new Date() } }),
  ]);
  revalidatePath(`/messages/${conversationId}`);
  return {};
}
