import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const url = process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL ?? process.env.POSTGRES_URL;
if (!url) throw new Error("DATABASE_URL is not set.");
const adapter = new PrismaPg(url);
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "מסיבות טכנו", slug: "techno", icon: "waveform" },
  { name: "הופעות חיות", slug: "live-music", icon: "mic" },
  { name: "פסטיבלים", slug: "festivals", icon: "sparkles" },
  { name: "מסיבות חוף", slug: "beach-parties", icon: "sun" },
  { name: "מועדונים", slug: "clubs", icon: "disc" },
  { name: "מסיבות רוקאין", slug: "rooftop", icon: "building" },
];

function daysFromNow(days: number, hour = 22) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
}

async function main() {
  console.log("Seeding database...");

  const createdCategories = new Map<string, string>();
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    createdCategories.set(c.slug, cat.id);
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "מנהל ראשי",
      email: adminEmail,
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  console.log(`Super admin ready: ${adminEmail} / ${adminPassword} (change after first login)`);

  const events = [
    {
      slug: "techno-underground-tlv",
      title: "Techno Underground — לילה בין הצינורות",
      description:
        "מסיבת טכנו אנדרגראונד בבונקר בלב תל אביב, עם שני דיג'יי אורחים מברלין וסאונד סיסטם מהחזקים בארץ. דלתות נפתחות בחצות, הכניסה מוגבלת.",
      coverImageUrl: "https://images.unsplash.com/photo-1571266028243-d220c9c3b31d?w=1200&q=80",
      startDate: daysFromNow(10),
      city: "תל אביב",
      venueName: "The Bunker",
      priceLabel: "מ-90 ש\"ח",
      affiliateUrl: "https://example-partner.com/events/techno-underground-tlv",
      affiliateNetwork: "Go-Out",
      categorySlug: "techno",
      featured: true,
    },
    {
      slug: "rooftop-sunset-sessions",
      title: "Rooftop Sunset Sessions",
      description:
        "מסיבת גג עם נוף לים, קוקטיילים, ודיג'יי סטים של האוס וטכנו קליל מהשקיעה ועד חצות. אירוע קבוע כל יום שישי.",
      coverImageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
      startDate: daysFromNow(4, 18),
      city: "תל אביב",
      venueName: "Sky Lounge",
      priceLabel: "כניסה חופשית עד 20:00",
      affiliateUrl: "https://example-partner.com/events/rooftop-sunset-sessions",
      affiliateNetwork: "Eventbrite",
      categorySlug: "rooftop",
      featured: true,
    },
    {
      slug: "desert-festival-2026",
      title: "פסטיבל המדבר 2026",
      description:
        "שלושה ימי מוזיקה, אמנות ומחנאות בלב המדבר. עשרות אמנים על שלוש במות, שוק אומנים, וסדנאות יוגה בזריחה.",
      coverImageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80",
      startDate: daysFromNow(45),
      endDate: daysFromNow(47),
      city: "מכתש רמון",
      venueName: "שטח האירועים מכתש רמון",
      priceLabel: "מ-450 ש\"ח לכרטיס שלושה ימים",
      affiliateUrl: "https://example-partner.com/events/desert-festival-2026",
      affiliateNetwork: "Custom Partner",
      categorySlug: "festivals",
      featured: true,
    },
    {
      slug: "acoustic-live-jaffa",
      title: "ערב אקוסטי ביפו העתיקה",
      description:
        "הופעה חיה אינטימית בחצר ביפו העתיקה, עם להקה מקומית וקהל מוגבל למאה איש בלבד. יין, גבינות ונוף לים.",
      coverImageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&q=80",
      startDate: daysFromNow(7, 20),
      city: "יפו",
      venueName: "חצר האמנים",
      priceLabel: "120 ש\"ח",
      affiliateUrl: "https://example-partner.com/events/acoustic-live-jaffa",
      affiliateNetwork: "Go-Out",
      categorySlug: "live-music",
      featured: false,
    },
    {
      slug: "beach-party-herzliya",
      title: "מסיבת חוף הרצליה",
      description:
        "מסיבת חוף עם מדורה, דיג'יי סטים עד הבוקר וברים על החול. הגעה מוקדמת מומלצת, מקום מוגבל.",
      coverImageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=80",
      startDate: daysFromNow(14, 19),
      city: "הרצליה",
      venueName: "חוף אכדיה",
      priceLabel: "מ-70 ש\"ח",
      affiliateUrl: "https://example-partner.com/events/beach-party-herzliya",
      affiliateNetwork: "Eventbrite",
      categorySlug: "beach-parties",
      featured: false,
    },
    {
      slug: "club-night-haifa",
      title: "Club Night — מועדון הנמל",
      description:
        "לילה של היפ הופ, R&B ובית עם ליין אפ מקומי חם, פינת VIP ומערכת סאונד חדשה שהותקנה החודש.",
      coverImageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&q=80",
      startDate: daysFromNow(2, 23),
      city: "חיפה",
      venueName: "מועדון הנמל",
      priceLabel: "80 ש\"ח בהזמנה מראש",
      affiliateUrl: "https://example-partner.com/events/club-night-haifa",
      affiliateNetwork: "Go-Out",
      categorySlug: "clubs",
      featured: false,
    },
  ];

  for (const e of events) {
    const { categorySlug, ...data } = e;
    await prisma.event.upsert({
      where: { slug: e.slug },
      update: {},
      create: {
        ...data,
        status: "PUBLISHED",
        categoryId: createdCategories.get(categorySlug)!,
        createdById: admin.id,
      },
    });
  }

  console.log(`Seeded ${categories.length} categories and ${events.length} events.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
