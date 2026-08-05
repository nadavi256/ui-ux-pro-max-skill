# EventHub — פלטפורמת קידום אירועים (Affiliate)

אתר קידום מסיבות, הופעות ואירועים בעברית (RTL), בנוי כמערכת שותפים (affiliate):
האתר מציג אירועים ועל כל לחיצה על "לרכישת כרטיסים" מפנה (302 redirect) לאתר השותף
החיצוני שמבצע את המכירה בפועל. האתר עצמו **אינו מבצע סליקה** ואינו שומר פרטי תשלום.

כולל מערכת ניהול (CMS) מלאה עם הרשאות משתמשים, קידום אורגני ל-Google ולמנועי
חיפוש מבוססי-AI, ו-API ציבורי המיועד לשמש בעתיד גם אפליקציית מובייל.

## סטאק טכנולוגי

- **Next.js 16** (App Router, Turbopack, React 19) — SSR/SSG לביצועי SEO מיטביים
- **Prisma 7** + SQLite (פיתוח) / PostgreSQL (פרודקשן), עם driver adapters
- **Auth.js (NextAuth v5)** — אימות מבוסס Credentials + JWT, 3 רמות הרשאה
- **Tailwind CSS v4** — עיצוב נייטלייף כהה, גרדיאנטים סגול/ורוד/כתום, RTL מלא
- **Zod** — ולידציה של כל הטפסים בצד שרת

## הרצה מקומית

```bash
npm install
cp .env.example .env      # ומלאו את הערכים (ברירת המחדל מספיקה לפיתוח מקומי)
npm run db:migrate        # יוצר את מסד הנתונים המקומי (SQLite) ואת הטבלאות
npm run db:seed           # יוצר משתמש Super Admin ראשוני + קטגוריות ואירועי דוגמה
npm run dev
```

האתר יעלה בכתובת http://localhost:3000, ופאנל הניהול בכתובת http://localhost:3000/admin/login.

פרטי ההתחברות הראשוניים נקבעים ב-`.env` (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`,
ברירת מחדל `admin@example.com` / `ChangeMe123!`) — **חובה להחליף סיסמה זו בפרודקשן**.

## מבנה ההרשאות בפאנל הניהול

| הרשאה | יכולות |
|---|---|
| **Super Admin** | הכל, כולל ניהול משתמשים אחרים והרשאותיהם |
| **Editor** | יצירה/עריכה/מחיקה של אירועים וקטגוריות |
| **Viewer** | צפייה בלוח הבקרה ובאנליטיקס קליקים בלבד |

הבדיקה מתבצעת בשני שלבים (כמומלץ ע"י Next.js): בדיקה אופטימית מהירה מבוססת-עוגייה
ב-`src/proxy.ts` (חוסמת גישה לא מחוברת ל-`/admin/*`), ובדיקה אמיתית מול השרת בכל
עמוד/Server Action דרך `src/lib/require-role.ts`.

## הזנת אירועים אמיתיים

יש שתי דרכים:
1. **דרך הפאנל** — `/admin/events/new`. לכל אירוע יש שדה "קישור שותף חיצוני" שהוא
   הכתובת שאליה מפנה כפתור "לרכישת כרטיסים" (העמוד הציבורי לא מפנה ישירות אליו,
   אלא דרך `/out/[slug]` שרושם קליק ב-`ClickLog` ואז מבצע 302 redirect — כך יש
   מעקב מלא אחרי קליקים לכל שותף).
2. **ייבוא בכמות** — אם יש לכם קובץ/רשימה של אירועים קיימים, אפשר להרחיב את
   `prisma/seed.ts` או לכתוב סקריפט ייבוא חד-פעמי שמשתמש ב-`prisma.event.createMany`
   (שלחו לי את הפורמט של הרשימה ואבנה עבורה סקריפט ייבוא ייעודי).

## SEO וקידום במנועי חיפוש (כולל AI)

- `app/sitemap.ts` — מפת אתר דינמית (כל האירועים/הקטגוריות המפורסמים)
- `app/robots.ts` — חוסם `/admin`, `/api`, `/out/` מאינדוקס
- `app/llms.txt/route.ts` — קובץ תקציר לסוכני AI/מנועי תשובות (המוסכמה המתפתחת
  המקבילה ל-robots.txt עבור LLMs), מפרט מה האתר ואיך הוא בנוי
- כל עמוד אירוע כולל **JSON-LD מסוג `Event`** (תאריך, מיקום, מחיר) לשיפור הופעה
  ב-Google (Rich Results) ובתשובות AI
- מטא-תגיות ייעודיות לכל אירוע/קטגוריה (title/description/Open Graph), הניתנות
  לעריכה ידנית בפאנל (שדות "כותרת SEO" / "תיאור SEO")
- קישורי היציאה מסומנים `rel="sponsored nofollow"` — תואם להנחיות גוגל לתוכן שותפים

## חיבור דומיין אמיתי

1. פרסו את האתר (למשל ל-Vercel: `vercel deploy` או חיבור הריפו ב-vercel.com).
2. בהגדרות הפרויקט אצל ספק האחסון, הוסיפו את הדומיין שלכם ועדכנו את רשומות ה-DNS
   בהתאם להוראות שהוא יציג (בד"כ רשומת A או CNAME).
3. עדכנו את `NEXT_PUBLIC_SITE_URL` בפרודקשן לכתובת הדומיין הסופית (חשוב ל-sitemap,
   מטא-תגיות, ו-JSON-LD).

## מעבר לפרודקשן (מסד נתונים)

לפיתוח האתר משתמש ב-SQLite מקומי. לפרודקשן מומלץ Postgres מנוהל (Vercel Postgres,
Supabase, Neon וכו'). המעבר הוא שינוי קונפיגורציה בלבד:

1. ערכו `DATABASE_URL` בסביבת הפרודקשן לכתובת postgres (`postgresql://...`) —
   `src/lib/prisma.ts` בוחר אוטומטית את ה-driver adapter המתאים (Postgres מול SQLite).
2. עדכנו את `datasource.provider` ב-`prisma/schema.prisma` ל-`"postgresql"`.
3. הריצו `npx prisma migrate deploy` מול מסד הפרודקשן.

## API ציבורי — הכנה לאפליקציית מובייל (Android / iOS)

כל הלוגיקה העסקית (שאילתות אירועים, מעקב קליקים) עטופה ב-`src/lib/events.ts`
וחשופה גם כ-REST API תחת `/api/v1/*`, כך שאפליקציית מובייל עתידית (React Native /
Flutter / Swift / Kotlin) יכולה לצרוך את אותו מקור נתונים בלי לשכפל לוגיקה:

| Endpoint | תיאור |
|---|---|
| `GET /api/v1/events?city=&category=&q=` | רשימת אירועים מפורסמים, עם סינון |
| `GET /api/v1/events/[slug]` | פרטי אירוע בודד |
| `GET /api/v1/categories` | רשימת קטגוריות |
| `POST /api/v1/click/[slug]` | רישום קליק, מחזיר `{ affiliateUrl }` לפתיחה בדפדפן חיצוני/in-app |

ה-API כולל CORS פתוח (`Access-Control-Allow-Origin: *`) כדי שאפליקציות ילידיות
יוכלו לקרוא לו ישירות. כשתהיה מוכנים לבנות את האפליקציה, זו נקודת ההתחלה הטבעית —
אין צורך לבנות backend נפרד.

## מבנה הפרויקט (עיקרי)

```
src/
  app/
    (public)/          עמודי האתר הציבורי (דף בית, אירועים, קטגוריות) + Navbar/Footer
    admin/              פאנל ניהול (login + (protected) עם sidebar לפי הרשאה)
    api/v1/             ה-API הציבורי לאפליקציות עתידיות
    out/[slug]/          route של מעקב קליקים + הפניה לשותף
    sitemap.ts, robots.ts, llms.txt/
  components/           קומפוננטות משותפות (public + admin/)
  lib/                   שכבת דאטה (events.ts, admin-data.ts), auth, prisma, actions/
  auth.ts, auth.config.ts, proxy.ts   הגדרת האימות (ר' פרק ההרשאות למעלה)
prisma/
  schema.prisma, seed.ts, migrations/
```

## פקודות שימושיות

```bash
npm run dev          # שרת פיתוח
npm run build        # בנייה לפרודקשן
npm run lint         # ESLint
npm run db:migrate   # יצירת/עדכון מיגרציות (פיתוח)
npm run db:deploy    # החלת מיגרציות בפרודקשן
npm run db:seed      # זריעת נתוני דוגמה + Super Admin ראשוני
npm run db:studio    # Prisma Studio — עיון/עריכה ויזואלית של המסד
```
