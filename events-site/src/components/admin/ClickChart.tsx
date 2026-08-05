interface Point {
  date: string;
  count: number;
}

const dayLabel = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "numeric" });

export function ClickChart({ data }: { data: Point[] }) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div>
      <div className="flex items-end gap-1.5 h-40" role="img" aria-label="גרף קליקים על אירועים ב-14 הימים האחרונים">
        {data.map((point) => (
          <div key={point.date} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="w-full rounded-t-md gradient-bg min-h-[2px]"
              style={{ height: `${(point.count / max) * 100}%` }}
              title={`${point.count} קליקים ב-${dayLabel.format(new Date(point.date))}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1.5 text-[10px] text-muted">
        {data.map((point, i) => (
          <div key={point.date} className="flex-1 text-center">
            {i % 2 === 0 ? dayLabel.format(new Date(point.date)) : ""}
          </div>
        ))}
      </div>
    </div>
  );
}
