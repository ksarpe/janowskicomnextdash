import { MessageSquare, MoreVertical } from "lucide-react";

// ── WidgetRow ─────────────────────────────────────────────────────────────────
export function WidgetRow({
  name,
  version,
  scope,
  status,
}: {
  name: string;
  version: string;
  scope: string;
  status: "active" | "paused" | "live";
}) {
  const statusConfig = {
    active: { label: "Aktywny", color: "#22c55e", bg: "#22c55e18" },
    paused: { label: "Wstrzymany", color: "#f59e0b", bg: "#f59e0b18" },
    live: { label: "Live", color: "var(--primary)", bg: "var(--primary)18" },
  }[status];

  return (
    <tr
      className="border-b group"
      style={{ borderColor: "var(--dash-border)" }}
    >
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "var(--primary)14",
              color: "var(--primary)",
            }}
          >
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text leading-tight">
              {name}
            </p>
            <p className="text-[11px] text-text-muted">
              {version} · {scope}
            </p>
          </div>
        </div>
      </td>

      <td className="py-3.5 px-4">
        <span
          className="text-[11px] font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5"
          style={{
            backgroundColor: statusConfig.bg,
            color: statusConfig.color,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: statusConfig.color }}
          />
          {statusConfig.label}
        </span>
      </td>
    </tr>
  );
}
