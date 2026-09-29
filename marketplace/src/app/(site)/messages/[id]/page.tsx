import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageComposer } from "@/components/MessageComposer";
import { getConversationForUser, markConversationRead } from "@/lib/conversations";
import { formatPrice, imageSrc } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata = { title: "שיחה", robots: { index: false } };

const timeFmt = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function ConversationPage(props: PageProps<"/messages/[id]">) {
  const { id } = await props.params;
  const user = await requireUser(`/messages/${id}`);
  const conversation = await getConversationForUser(id, user.id);
  if (!conversation) notFound();
  await markConversationRead(id, user.id);

  const { listing } = conversation;
  const other = conversation.buyer.id === user.id ? listing.seller : conversation.buyer;

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-4 py-4">
      <div className="flex items-center gap-2">
        <Link
          href="/messages"
          aria-label="חזרה להודעות"
          className="grid size-11 place-items-center rounded-full transition-colors duration-200 hover:bg-muted"
        >
          <ChevronRight className="size-5" aria-hidden />
        </Link>
        <h1 className="text-lg font-bold">{other.name}</h1>
      </div>

      <Link
        href={`/listing/${listing.id}`}
        className="mt-2 flex items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-colors duration-200 hover:bg-muted/50"
      >
        <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">
          {listing.images[0] && (
            <Image src={imageSrc(listing.images[0])} alt="" fill sizes="48px" className="object-cover" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold">{listing.title}</p>
          <p className="text-sm font-bold text-primary">
            {formatPrice(listing.price)}
            {listing.status === "SOLD" && <span className="ms-2 font-normal text-muted-foreground">· נמכר</span>}
          </p>
        </div>
      </Link>

      <ol className="my-4 flex flex-col gap-2" aria-label="הודעות בשיחה">
        {conversation.messages.map((m) => {
          const mine = m.senderId === user.id;
          return (
            <li key={m.id} className={`flex ${mine ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${mine ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm border border-border bg-card"}`}
              >
                <p className="whitespace-pre-line">{m.body}</p>
                <p className={`mt-1 text-[11px] ${mine ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                  {timeFmt.format(m.createdAt)}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="sticky bottom-20 md:bottom-4">
        <MessageComposer conversationId={conversation.id} />
      </div>
    </div>
  );
}
