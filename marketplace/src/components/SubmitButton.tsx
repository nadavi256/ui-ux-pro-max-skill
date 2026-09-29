import { LoaderCircle } from "lucide-react";

export function SubmitButton({
  pending,
  children,
  variant = "primary",
  className = "",
}: {
  pending: boolean;
  children: React.ReactNode;
  variant?: "primary" | "cta";
  className?: string;
}) {
  const colors =
    variant === "cta"
      ? "bg-cta text-cta-foreground hover:bg-cta-hover"
      : "bg-primary text-primary-foreground hover:bg-primary-hover";
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`flex h-12 items-center justify-center gap-2 rounded-xl px-6 font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${colors} ${className}`}
    >
      {pending && <LoaderCircle className="size-5 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}
