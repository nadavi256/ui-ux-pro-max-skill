import type { Metadata } from "next";
import { RegionEventsSection } from "@/components/RegionEventsSection";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "אירועים בדרום",
  description: `כל המסיבות וההופעות הקרובות באזור הדרום ב${siteConfig.name}.`,
  alternates: { canonical: "/darom" },
};

export default function DaromPage() {
  return (
    <RegionEventsSection
      title="דרום"
      subtitle="כל המסיבות וההופעות הקרובות באזור הדרום."
      filters={{ city: "דרום" }}
    />
  );
}
