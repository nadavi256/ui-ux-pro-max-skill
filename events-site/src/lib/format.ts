const dateFormatter = new Intl.DateTimeFormat("he-IL", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("he-IL", {
  hour: "2-digit",
  minute: "2-digit",
});

export function formatEventDate(start: Date, end?: Date | null) {
  const startLabel = `${dateFormatter.format(start)} · ${timeFormatter.format(start)}`;
  if (!end) return startLabel;
  return `${dateFormatter.format(start)} – ${dateFormatter.format(end)}`;
}
