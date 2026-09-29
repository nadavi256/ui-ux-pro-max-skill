import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/AuthForms";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { getCurrentUser } from "@/lib/session";

export const metadata = { title: "הרשמה", robots: { index: false } };

export default async function RegisterPage(props: PageProps<"/register">) {
  const { callbackUrl } = await props.searchParams;
  const url = typeof callbackUrl === "string" ? safeRedirectPath(callbackUrl) : undefined;
  if (await getCurrentUser()) redirect(url ?? "/");

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h1 className="text-2xl font-bold">הרשמה</h1>
        <p className="mt-1 mb-6 text-muted-foreground">חינם, לוקח חצי דקה.</p>
        <RegisterForm callbackUrl={url} />
      </div>
    </div>
  );
}
