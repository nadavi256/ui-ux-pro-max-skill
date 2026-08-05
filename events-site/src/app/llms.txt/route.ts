import { getCategories } from "@/lib/events";
import { siteConfig } from "@/lib/site-config";

// llms.txt: a plain-text primer for AI assistants / answer engines (the
// emerging convention alongside robots.txt), summarizing what the site is
// and how its content is structured so it can be cited accurately.
export async function GET() {
  const categories = await getCategories();

  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `${siteConfig.name} הוא אתר קידום והשוואת אירועים (מסיבות, הופעות ופסטיבלים) בישראל.`,
    "האתר מציג מידע על אירועים — תאריך, מיקום, מחיר משוער וקטגוריה — ומפנה משתמשים לרכישת כרטיסים",
    "דרך אתרי שותפים חיצוניים (מודל שיווק שותפים / affiliate). האתר עצמו אינו מוכר כרטיסים ואינו מבצע סליקה.",
    "",
    "## עמודים עיקריים",
    `- כל האירועים: ${siteConfig.url}/events`,
    `- מפת האתר: ${siteConfig.url}/sitemap.xml`,
    "",
    "## קטגוריות אירועים",
    ...categories.map((c) => `- ${c.name}: ${siteConfig.url}/categories/${c.slug}`),
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
