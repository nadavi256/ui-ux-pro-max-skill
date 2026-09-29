const priceFormatter = new Intl.NumberFormat("he-IL", {
  style: "currency",
  currency: "ILS",
  maximumFractionDigits: 0,
});

export function formatPrice(price: number) {
  return price === 0 ? "למסירה" : priceFormatter.format(price);
}

const rtf = new Intl.RelativeTimeFormat("he", { numeric: "auto" });

export function timeAgo(date: Date) {
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return "הרגע";
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(seconds / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(seconds / 86400), "day");
  return new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function imageSrc(image: { id: string; url: string | null }) {
  return image.url ?? `/api/images/${image.id}`;
}

// Israeli local number (05X...) → international form for wa.me / tel: links.
export function toIntlPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? `972${digits.slice(1)}` : digits;
}
