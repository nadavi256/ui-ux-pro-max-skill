import type { Condition } from "@/generated/prisma/client";

export const CONDITION_LABELS: Record<Condition, string> = {
  NEW: "חדש באריזה",
  LIKE_NEW: "כמו חדש",
  USED: "משומש",
  NEEDS_REPAIR: "דורש תיקון",
};

export const CONDITIONS = Object.keys(CONDITION_LABELS) as Condition[];

export const CITIES = [
  "תל אביב-יפו",
  "ירושלים",
  "חיפה",
  "ראשון לציון",
  "פתח תקווה",
  "אשדוד",
  "נתניה",
  "באר שבע",
  "בני ברק",
  "חולון",
  "רמת גן",
  "אשקלון",
  "רחובות",
  "בת ים",
  "הרצליה",
  "כפר סבא",
  "חדרה",
  "מודיעין",
  "רעננה",
  "הוד השרון",
  "רמלה",
  "לוד",
  "נהריה",
  "קריית גת",
  "עפולה",
  "גבעתיים",
  "קריית אתא",
  "אילת",
  "טבריה",
  "כרמיאל",
  "ראש העין",
  "יבנה",
  "נס ציונה",
  "אור יהודה",
  "צפת",
  "זכרון יעקב",
  "קיסריה",
  "אחר",
] as const;

export const SORT_OPTIONS = {
  new: "החדשות ביותר",
  "price-asc": "מחיר: מהנמוך לגבוה",
  "price-desc": "מחיר: מהגבוה לנמוך",
} as const;

export type SortKey = keyof typeof SORT_OPTIONS;

export const MAX_IMAGES = 6;
export const MAX_IMAGE_BYTES = 1_000_000;
export const PAGE_SIZE = 24;
