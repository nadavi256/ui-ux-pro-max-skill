export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
