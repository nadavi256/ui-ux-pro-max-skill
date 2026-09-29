import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { countUnreadMessages } from "@/lib/listings";
import { getCurrentUser } from "@/lib/session";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  const unread = user ? await countUnreadMessages(user.id) : 0;

  return (
    <>
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <BottomNav unread={unread} />
    </>
  );
}
