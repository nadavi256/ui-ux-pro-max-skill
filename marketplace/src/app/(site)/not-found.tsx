import { SearchX } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <EmptyState
        icon={SearchX}
        title="העמוד לא נמצא"
        text="ייתכן שהמודעה נמחקה או שהקישור שגוי."
        action={{ href: "/", label: "לדף הבית" }}
      />
    </div>
  );
}
