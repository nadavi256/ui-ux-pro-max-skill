import { prisma } from "@/lib/prisma";

export function getConversations(userId: string) {
  return prisma.conversation.findMany({
    where: { OR: [{ buyerId: userId }, { listing: { sellerId: userId } }] },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      updatedAt: true,
      buyer: { select: { id: true, name: true } },
      listing: {
        select: {
          id: true,
          title: true,
          price: true,
          seller: { select: { id: true, name: true } },
          images: { select: { id: true, url: true }, orderBy: { order: "asc" }, take: 1 },
        },
      },
      messages: { orderBy: { createdAt: "desc" }, take: 1, select: { body: true, senderId: true, readAt: true } },
    },
  });
}

export async function getConversationForUser(id: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    select: {
      id: true,
      buyer: { select: { id: true, name: true } },
      listing: {
        select: {
          id: true,
          title: true,
          price: true,
          status: true,
          sellerId: true,
          seller: { select: { id: true, name: true } },
          images: { select: { id: true, url: true }, orderBy: { order: "asc" }, take: 1 },
        },
      },
      messages: { orderBy: { createdAt: "asc" }, select: { id: true, body: true, senderId: true, createdAt: true } },
    },
  });
  if (!conversation) return null;
  if (conversation.buyer.id !== userId && conversation.listing.sellerId !== userId) return null;
  return conversation;
}

export function markConversationRead(conversationId: string, userId: string) {
  return prisma.message.updateMany({
    where: { conversationId, senderId: { not: userId }, readAt: null },
    data: { readAt: new Date() },
  });
}
