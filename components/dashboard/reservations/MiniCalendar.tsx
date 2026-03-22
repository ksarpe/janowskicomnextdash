import { useState } from "react";
import { Appointment } from "@prisma/client";
import { Clock, X } from "lucide-react";

export function MiniCalendar({
  appointments,
  onSeeAll,
}: {
  appointments: Appointment[];
  onSeeAll: (day: number) => void;
}) {
  const [popoverDay, setPopoverDay] = useState<number | null>(null);
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  const totalCells = Math.ceil((daysInMonth + offset) / 7) * 7;

  const dayHours: Record<number, string[]> = {};
  appointments.forEach((r) => {
    try {
      const d = new Date(r.date);
      if (d.getMonth() === month && d.getFullYear() === year) {
        const day = d.getDate();
        if (!dayHours[day]) dayHours[day] = [];
        if (r.startTime) dayHours[day].push(r.startTime);
      }
    } catch {}
  });

  Object.keys(dayHours).forEach((k) => {
    dayHours[k as unknown as number].sort();
  });

  const cells = Array.from({ length: totalCells }).map((_, i) => {
    const day = i - offset + 1;
    const isCurrentMonth = day > 0 && day <= daysInMonth;
    let bgColor = "var(--bg-alt)";
    let opacity = 1;
    let isBusy = false;

    if (isCurrentMonth) {
      const count = dayHours[day]?.length || 0;
      if (count === 1)
        bgColor = "#22c55e"; // green
      else if (count === 2)
        bgColor = "#eab308"; // yellow
      else if (count >= 3) bgColor = "#ef4444"; // red
      if (count > 0) isBusy = true;
    } else {
      opacity = 0.3;
    }

    return (
      <div
        key={i}
        onClick={() => {
          if (isCurrentMonth && isBusy) setPopoverDay(day);
        }}
        className={`w-full aspect-square rounded-md transition-all shadow-sm flex p-1 relative ${isCurrentMonth && isBusy ? "cursor-pointer hover:scale-110" : ""}`}
        style={{ backgroundColor: bgColor, opacity }}
        title={
          isCurrentMonth
            ? `Dzień ${day}: ${dayHours[day]?.length || 0} wizyt`
            : undefined
        }
      >
        {isCurrentMonth && (
          <span
            className="text-[10px] font-bold"
            style={{
              color: isBusy ? "#fff" : "var(--text-subtle)",
              textShadow: isBusy ? "0 1px 2px rgba(0,0,0,0.4)" : "none",
            }}
          >
            {day}
          </span>
        )}
      </div>
    );
  });

  return (
    <div
      className="relative rounded-2xl border flex flex-col h-full overflow-hidden"
      style={{
        backgroundColor: "var(--dash-card)",
        borderColor: "var(--dash-border)",
      }}
    >
      <div
        className="px-5 py-4 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: "var(--dash-border)" }}
      >
        <h3 className="text-sm font-bold text-text">
          Intensywność (ten miesiąc)
        </h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#71717a]">
          {date.toLocaleDateString("pl-PL", { month: "long" })}
        </span>
      </div>
      <div className="p-5 flex-1 flex flex-col justify-center bg-dash-card">
        <div className="grid grid-cols-7 gap-1.5 md:gap-2 mb-6">
          {["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"].map((d) => (
            <div
              key={d}
              className="text-[10px] pb-1 font-bold text-text-subtle text-center uppercase"
            >
              {d}
            </div>
          ))}
          {cells}
        </div>
        <div className="flex items-center justify-between text-[10px] mt-auto font-bold text-text-subtle uppercase tracking-wider">
          <span>Wolne</span>
          <div className="flex gap-1.5">
            <div
              className="w-3.5 h-3.5 rounded-sm shadow-sm"
              style={{ backgroundColor: "var(--bg-alt)" }}
            />
            <div
              className="w-3.5 h-3.5 rounded-sm shadow-sm"
              style={{ backgroundColor: "#22c55e" }}
            />
            <div
              className="w-3.5 h-3.5 rounded-sm shadow-sm"
              style={{ backgroundColor: "#eab308" }}
            />
            <div
              className="w-3.5 h-3.5 rounded-sm shadow-sm"
              style={{ backgroundColor: "#ef4444" }}
            />
          </div>
          <span>Zajęte</span>
        </div>
      </div>

      {popoverDay !== null && (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
          <div
            className="w-full rounded-2xl border shadow-2xl p-4 flex flex-col animate-in fade-in zoom-in-95 duration-200"
            style={{
              backgroundColor: "var(--dash-card)",
              borderColor: "var(--dash-border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-text">
                Dzień {popoverDay}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPopoverDay(null);
                }}
                className="p-1 hover:bg-bg-alt rounded-lg text-text-muted transition-colors"
                title="Zamknij popup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-text-muted font-medium mb-3">
              Zapisane wizyty (godziny):
            </p>
            <div className="flex flex-wrap gap-2 mb-5 max-h-[120px] overflow-y-auto w-full no-scrollbar">
              {dayHours[popoverDay]?.length > 0 ? (
                dayHours[popoverDay].map((t, idx) => (
                  <div
                    key={idx}
                    className="px-2 py-1 flex items-center gap-1.5 bg-[var(--primary)18] border rounded-lg text-xs font-bold"
                    style={{
                      borderColor: "var(--primary)",
                      color: "var(--primary)",
                    }}
                  >
                    <Clock className="w-3 h-3" />
                    {t}
                  </div>
                ))
              ) : (
                <p className="text-xs text-text-muted">
                  Brak zapisanych godzin
                </p>
              )}
            </div>
            <button
              onClick={() => {
                onSeeAll(popoverDay);
                setPopoverDay(null);
              }}
              className="w-full py-2.5 font-bold text-white text-xs rounded-xl transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Zobacz wizyty
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
