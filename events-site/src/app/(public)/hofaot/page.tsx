import type { Metadata } from "next";
import { RegionEventsSection } from "@/components/RegionEventsSection";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "הופעות",
  description: `כל ההופעות הקרובות ב${siteConfig.name}.`,
  alternates: { canonical: "/hofaot" },
};

export default function HofaotPage() {
  return (
    <RegionEventsSection
      title="הופעות"
      subtitle="כל ההופעות הקרובות ברחבי הארץ."
      filters={{ categorySlug: "shows" }}
    />
  );
}
