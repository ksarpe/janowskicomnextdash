import Link from "next/link";
import { WidgetRow } from "./WidgetRow";
import { ArrowUpRight } from "lucide-react";

export function WidgetBox() {
  return (
    <div
      className="rounded-2xl border overflow-hidden flex flex-col"
      style={{
        backgroundColor: "var(--dash-card)",
        borderColor: "var(--dash-border)",
      }}
    >
      <div
        className="px-5 py-4 border-b flex items-center justify-between"
        style={{ borderColor: "var(--dash-border)" }}
      >
        <h3 className="text-sm font-bold text-text">Twoje Widżety</h3>
        <Link href="/settings">
          <ArrowUpRight className="w-5 h-5 opacity-60 cursor-pointer hover:bg-primary/40 rounded-sm" />
        </Link>
      </div>

      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--dash-border)" }}>
              {["Widget", "Status", ""].map((h) => (
                <th
                  key={h}
                  className="text-left text-[10px] font-black uppercase tracking-widest text-text-subtle px-4 py-2.5 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <WidgetRow
              name="Chat Widget"
              version="v1.0"
              scope="Global"
              status="live"
            />
            <WidgetRow
              name="Booking System"
              version="v—"
              scope="Wkrótce"
              status="paused"
            />
            <WidgetRow
              name="3D Visualization"
              version="v—"
              scope="Wkrótce"
              status="paused"
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
