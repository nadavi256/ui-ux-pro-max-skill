import { MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/EmptyState";
import { getConversations } from "@/lib/conversations";
import { imageSrc } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata = { title: "הודעות", robots: { index: false } };

export default async function MessagesPage() {
  const user = await requireUser("/messages");
  const conversations = await getConversations(user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">הודעות</h1>
      {conversations.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="אין עדיין שיחות"
          text="כשתשלחו הודעה למוכר, או כשמישהו יתעניין במודעה שלכם — השיחה תופיע כאן."
        />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {conversations.map((c) => {
            const other = c.buyer.id === user.id ? c.listing.seller : c.buyer;
            const last = c.messages[0];
            const unread = last && last.senderId !== user.id && !last.readAt;
            return (
              <li key={c.id}>
                <Link
                  href={`/messages/${c.id}`}
                  className="flex items-center gap-3 p-4 transition-colors duration-200 hover:bg-muted/50"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                    {c.listing.images[0] && (
                      <Image src={imageSrc(c.listing.images[0])} alt="" fill sizes="56px" className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center justify-between gap-2">
                      <span className={`truncate ${unread ? "font-bold" : "font-semibold"}`}>{other.name}</span>
                      {unread && <span className="size-2.5 shrink-0 rounded-full bg-primary" aria-label="הודעה חדשה" />}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">{c.listing.title}</p>
                    {last && (
                      <p className={`truncate text-sm ${unread ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                        {last.senderId === user.id && "את/ה: "}
                        {last.body}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
