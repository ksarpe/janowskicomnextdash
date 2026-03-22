import { Calendar } from "lucide-react";
import Link from "next/link";

export function ScheduleBox() {
  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-2xl border flex-1 flex flex-col"
        style={{
          backgroundColor: "var(--dash-card)",
          borderColor: "var(--dash-border)",
        }}
      >
        <div
          className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--dash-border)" }}
        >
          <h3 className="text-sm font-bold text-text">
            Dzisiejszy harmonogram
          </h3>
          <Link
            href="/reservations"
            className="text-[10px] font-bold px-2 py-1 rounded-lg border transition-colors hover:opacity-80 uppercase tracking-wider text-text-muted"
            style={{
              borderColor: "var(--dash-border)",
              backgroundColor: "var(--bg-alt)",
            }}
          >
            Wizyty
          </Link>
        </div>
        <div className="px-5 flex-1 flex flex-col items-center justify-center py-8 min-h-[200px] text-center opacity-80">
          <div
            className="w-12 h-12 mb-3 rounded-2xl flex items-center justify-center"
            style={{
              backgroundColor: "var(--bg-alt)",
              color: "var(--text-muted)",
            }}
          >
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-text">Brak wizyt na dziś</p>
          <p className="text-[11px] text-text-subtle mt-0.5 max-w-[180px]">
            Twój kalendarz rezerwacji świeci dzisiaj pustkami.
          </p>
        </div>
      </div>
    </div>
  );
}
