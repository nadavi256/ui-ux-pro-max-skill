import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "אודות",
  description: `אודות ${siteConfig.name} — אתר קידום מסיבות, הופעות ואירועים בישראל.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-black text-foreground sm:text-5xl">אודות {siteConfig.name}</h1>
      <p className="mt-6 whitespace-pre-line text-base leading-relaxed text-muted-foreground">
        {siteConfig.name} הוא אתר קידום אירועים שנועד לרכז במקום אחד את כל המסיבות, הפסטיבלים וההופעות
        החמות בישראל — צפון, מרכז ודרום. אנחנו לא מוכרים כרטיסים בעצמנו: לכל אירוע באתר יש קישור ישיר
        לאתר השותף הרשמי המפעיל את המכירה, כדי שתוכלו לרכוש כרטיסים בביטחון ישירות מהמפיק.
        {"\n\n"}
        האתר מתעדכן באופן שוטף עם אירועים חדשים, ואנחנו עובדים כל הזמן כדי להביא לכם את הרשימה המלאה
        והמעודכנת ביותר של חיי הלילה בישראל.
      </p>
    </div>
  );
}
