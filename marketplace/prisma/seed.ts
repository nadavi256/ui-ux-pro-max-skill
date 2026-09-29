import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { type Condition, PrismaClient } from "../src/generated/prisma/client";
import { DEFAULT_CATEGORIES } from "../src/lib/categories-data";

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL ?? process.env.POSTGRES_URL;
if (!url) throw new Error("DATABASE_URL is not set");
const prisma = new PrismaClient({ adapter: new PrismaPg(url) });

const img = (id: string) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=crop`;

type Demo = {
  title: string;
  description: string;
  price: number;
  condition: Condition;
  city: string;
  category: string;
  photo: string;
  seller: 0 | 1 | 2;
  daysAgo: number;
};

const DEMO_LISTINGS: Demo[] = [
  { title: "ספה תלת-מושבית ירוקה, קטיפה", description: "ספה במצב מצוין, בת שנתיים. רוחב 2.10 מ׳. מוכרת בגלל מעבר דירה. איסוף עצמי מקומה 2 עם מעלית.", price: 1800, condition: "LIKE_NEW", city: "תל אביב-יפו", category: "furniture", photo: "photo-1555041469-a586c61ea9bc", seller: 0, daysAgo: 0 },
  { title: "אייפון 13, 128GB, סוללה 88%", description: "שמור מאוד, תמיד עם כיסוי ומגן מסך. מגיע עם קופסה מקורית ומטען.", price: 1650, condition: "USED", city: "רמת גן", category: "phones", photo: "photo-1511707171634-5f897ff02aa9", seller: 1, daysAgo: 0 },
  { title: "מחשב נייד מקבוק אייר", description: "עובד מעולה, מתאים ללימודים ולעבודה. שריטה קטנה בתחתית. כולל מטען מקורי.", price: 2400, condition: "USED", city: "חיפה", category: "computers", photo: "photo-1496181133206-80ce9b88a853", seller: 2, daysAgo: 1 },
  { title: "אופני כביש, מידה M", description: "אופני כביש קלים, 18 הילוכים, עברו טיפול לפני חודש. צמיגים חדשים.", price: 1200, condition: "USED", city: "מודיעין", category: "bikes", photo: "photo-1485965120184-e220f721d03e", seller: 0, daysAgo: 1 },
  { title: "נעלי ריצה נייקי, מידה 43", description: "נעולות פעמיים בלבד, לא התאימו לי. כמו חדשות.", price: 250, condition: "LIKE_NEW", city: "ראשון לציון", category: "fashion", photo: "photo-1542291026-7eec264c27ff", seller: 1, daysAgo: 2 },
  { title: "שעון יד קלאסי", description: "שעון אנלוגי עם רצועת עור, עובד מצוין. מתנה שלא בשימוש.", price: 320, condition: "LIKE_NEW", city: "ירושלים", category: "fashion", photo: "photo-1523275335684-37898b6baf30", seller: 2, daysAgo: 2 },
  { title: "אוזניות אלחוטיות עם ביטול רעשים", description: "סאונד מעולה, סוללה מחזיקה כ-20 שעות. כולל נרתיק.", price: 450, condition: "USED", city: "הרצליה", category: "computers", photo: "photo-1505740420928-5e560c06d30e", seller: 0, daysAgo: 3 },
  { title: "ערימת ספרי קריאה — למסירה", description: "כ-15 ספרים בעברית, רומנים ומתח. למסירה בחינם, רק לבוא לקחת.", price: 0, condition: "USED", city: "כפר סבא", category: "books", photo: "photo-1544947950-fa07a98d237f", seller: 1, daysAgo: 3 },
  { title: "כורסה מעוצבת לסלון", description: "כורסה נוחה במיוחד, ריפוד בד אפור. ללא כתמים. מגיעה מבית ללא עישון.", price: 650, condition: "LIKE_NEW", city: "נתניה", category: "furniture", photo: "photo-1586023492125-27b2c045efd7", seller: 2, daysAgo: 4 },
  { title: "שולחן עבודה מעץ + כיסא", description: "שולחן 120x60, יציב. הכיסא ארגונומי עם גלגלים. נמכרים יחד.", price: 500, condition: "USED", city: "פתח תקווה", category: "furniture", photo: "photo-1518455027359-f3f8164ba6bd", seller: 0, daysAgo: 5 },
  { title: "מנורת עמידה נורדית", description: "מנורה עם אהיל בד, גובה 1.60. כולל נורת LED.", price: 0, condition: "USED", city: "גבעתיים", category: "home-decor", photo: "photo-1507473885765-e6ed057f782c", seller: 1, daysAgo: 5 },
  { title: "קונסולת משחקים + 2 שלטים", description: "עובדת מצוין, כולל 3 משחקים. מוכר כי אין זמן לשחק.", price: 1100, condition: "USED", city: "באר שבע", category: "gaming", photo: "photo-1606144042614-b2417e99c4e3", seller: 2, daysAgo: 6 },
  { title: "גיטרה אקוסטית למתחילים", description: "גיטרה במצב טוב, מיתרים חדשים. כולל תיק נשיאה וכונן.", price: 380, condition: "USED", city: "רחובות", category: "music", photo: "photo-1510915361894-db8b60106cb1", seller: 0, daysAgo: 7 },
  { title: "משקולות יד מתכווננות", description: "זוג משקולות 2–24 ק״ג, חוסכות מקום. כמעט לא היו בשימוש.", price: 700, condition: "LIKE_NEW", city: "חולון", category: "sports", photo: "photo-1517836357463-d25dfeac3438", seller: 1, daysAgo: 8 },
  { title: "עגלת תינוק משולבת", description: "עגלה + סלקל, מתקפלת בקלות. הילד גדל, העגלה עדיין מעולה.", price: 900, condition: "USED", city: "אשדוד", category: "baby", photo: "photo-1591088398332-8a7791972843", seller: 2, daysAgo: 9 },
  { title: "מצלמה דיגיטלית + עדשה", description: "מצלמת מראה עם עדשת קיט, 2 סוללות וכרטיס זיכרון.", price: 1900, condition: "USED", city: "תל אביב-יפו", category: "computers", photo: "photo-1516035069371-29a1b244cc32", seller: 0, daysAgo: 10 },
  { title: "צמחי בית בעציצים — למסירה", description: "מונסטרה ופוטוס, מעבירה דירה ולא יכולה לקחת. להרים עד שישי.", price: 0, condition: "USED", city: "ירושלים", category: "garden", photo: "photo-1459411552884-841db9b3cc2a", seller: 1, daysAgo: 11 },
  { title: "מקדחה אלחוטית + סט ביטים", description: "2 סוללות, מטען ומזוודה. עובדת מצוין.", price: 280, condition: "USED", city: "חדרה", category: "tools", photo: "photo-1504148455328-c376907d081c", seller: 2, daysAgo: 12 },
];

async function main() {
  for (const [order, c] of DEFAULT_CATEGORIES.entries()) {
    await prisma.category.upsert({ where: { slug: c.slug }, create: { ...c, order }, update: { name: c.name, icon: c.icon, order } });
  }
  const categories = Object.fromEntries((await prisma.category.findMany()).map((c) => [c.slug, c.id]));

  const adminEmail = (process.env.SEED_ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  await prisma.user.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, name: "מנהל", role: "ADMIN", passwordHash: await bcrypt.hash(adminPassword, 10) },
    update: {},
  });

  const demoHash = await bcrypt.hash("Demo12345!", 10);
  const sellers = await Promise.all(
    [
      { email: "noa@demo.local", name: "נועה", phone: "050-1234567", city: "תל אביב-יפו" },
      { email: "yossi@demo.local", name: "יוסי", phone: "052-7654321", city: "רמת גן" },
      { email: "dana@demo.local", name: "דנה", phone: "054-5550000", city: "חיפה" },
    ].map((u) => prisma.user.upsert({ where: { email: u.email }, create: { ...u, passwordHash: demoHash }, update: {} })),
  );

  const existing = await prisma.listing.count({ where: { sellerId: { in: sellers.map((s) => s.id) } } });
  if (existing > 0) {
    console.log("Demo listings already exist — skipping.");
    return;
  }

  for (const d of DEMO_LISTINGS) {
    const createdAt = new Date(Date.now() - d.daysAgo * 86_400_000 - Math.random() * 36_000_000);
    await prisma.listing.create({
      data: {
        title: d.title,
        description: d.description,
        price: d.price,
        condition: d.condition,
        city: d.city,
        createdAt,
        views: Math.floor(Math.random() * 300),
        sellerId: sellers[d.seller].id,
        categoryId: categories[d.category],
        images: { create: [{ url: img(d.photo), order: 0 }] },
      },
    });
  }
  console.log(`Seeded ${DEMO_LISTINGS.length} demo listings.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
