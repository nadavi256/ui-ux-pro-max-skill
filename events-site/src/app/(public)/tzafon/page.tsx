import type { Metadata } from "next";
import { RegionEventsSection } from "@/components/RegionEventsSection";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "אירועים בצפון",
  description: `כל המסיבות וההופעות הקרובות באזור הצפון ב${siteConfig.name}.`,
  alternates: { canonical: "/tzafon" },
};

export default function TzafonPage() {
  return (
    <RegionEventsSection
      title="צפון"
      subtitle="כל המסיבות וההופעות הקרובות באזור הצפון."
      filters={{ city: "צפון" }}
    />
  );
}
