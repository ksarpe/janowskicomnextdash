// ── ActivityItem ──────────────────────────────────────────────────────────────
export function ActivityItem({
  title,
  sub,
  time,
  type,
}: {
  title: string;
  sub: string;
  time: string;
  type: "success" | "warning" | "info";
}) {
  const dot = {
    success: "#22c55e",
    warning: "#f59e0b",
    info: "var(--primary)",
  }[type];
  return (
    <div
      className="flex items-start gap-3 py-3 border-b last:border-0"
      style={{ borderColor: "var(--dash-border)" }}
    >
      <div
        className="w-2 h-2 rounded-full shrink-0 mt-1.5"
        style={{ backgroundColor: dot }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text leading-snug">{title}</p>
        <p className="text-[11px] text-text-muted mt-0.5 truncate">{sub}</p>
        <p className="text-[10px] text-text-subtle mt-1 font-medium uppercase tracking-wide">
          {time}
        </p>
      </div>
    </div>
  );
}
