import { Banknote, Eye, MapPin, MessageCircle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "טיפים לקנייה ומכירה בטוחה",
  description: "איך קונים ומוכרים יד שנייה בבטחה: פגישה במקום ציבורי, בדיקת הפריט לפני תשלום והימנעות מהונאות.",
};

const tips = [
  { icon: MapPin, title: "נפגשים במקום ציבורי", text: "עדיף במקום מואר והומה אנשים, ובשעות היום. אפשר להביא חבר/ה." },
  { icon: Eye, title: "בודקים לפני שמשלמים", text: "מדליקים, מנסים, מודדים. אל תעבירו כסף על פריט שלא ראיתם." },
  {
    icon: Banknote,
    title: "לא משלמים מראש",
    text: "בקשה ל'מקדמה' או להעברה לפני פגישה היא סימן אזהרה. העדיפו תשלום במקום (מזומן / ביט / פייבוקס).",
  },
  {
    icon: MessageCircle,
    title: "נשארים בשיחה באתר",
    text: "היזהרו מקישורים חיצוניים לתשלום או 'משלוח', ואל תמסרו קודי אימות מ-SMS לאף אחד.",
  },
];

export default function SafetyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-xl bg-primary-soft text-primary">
          <ShieldCheck className="size-6" aria-hidden />
        </span>
        <h1 className="text-2xl font-bold md:text-3xl">קונים ומוכרים בבטחה</h1>
      </div>
      <ul className="mt-8 flex flex-col gap-4">
        {tips.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
            <Icon className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden />
            <div>
              <h2 className="font-bold">{title}</h2>
              <p className="mt-1 leading-relaxed text-muted-foreground">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
