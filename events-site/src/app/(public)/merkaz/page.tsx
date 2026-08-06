import type { Metadata } from "next";
import { RegionEventsSection } from "@/components/RegionEventsSection";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "אירועים במרכז",
  description: `כל המסיבות וההופעות הקרובות באזור המרכז ב${siteConfig.name}.`,
  alternates: { canonical: "/merkaz" },
};

export default function MerkazPage() {
  return (
    <RegionEventsSection
      title="מרכז"
      subtitle="כל המסיבות וההופעות הקרובות באזור המרכז."
      filters={{ city: "מרכז" }}
    />
  );
}
