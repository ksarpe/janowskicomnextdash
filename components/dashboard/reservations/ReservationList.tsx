"use client";

import { useState } from "react";
import { Reservation } from "@prisma/client";
import { Check, X, Calendar, TrendingUp } from "lucide-react";
import { ReservationRow } from "./ReservationRow";
import { MiniCalendar } from "./MiniCalendar";

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  reservations: Reservation[];
  pendingCount: number;
  acceptedCount: number;
  totalCount: number;
}

export default function ReservationList({
  reservations,
  pendingCount,
  acceptedCount,
  totalCount,
}: Props) {
  const [filteredDay, setFilteredDay] = useState<number | null>(null);

  const displayedReservations =
    filteredDay !== null
      ? reservations.filter((r) => {
          try {
            const d = new Date(r.date);
            return (
              d.getDate() === filteredDay &&
              d.getMonth() === new Date().getMonth() &&
              d.getFullYear() === new Date().getFullYear()
            );
          } catch {
            return false;
          }
        })
      : reservations;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Daily velocity */}
        <div
          className="rounded-2xl border p-5 relative overflow-hidden"
          style={{
            backgroundColor: "var(--dash-card)",
            borderColor: "var(--dash-border)",
          }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-text-subtle mb-2">
            Wszystkie wizyty
          </p>
          <div className="flex items-end gap-3">
            <p className="text-4xl font-black text-text">{totalCount}</p>
            <p className="text-sm text-text-muted mb-1">łącznie</p>
          </div>
          <p className="text-xs text-emerald-500 flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" />
            Zapisanych wizyt
          </p>
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{ backgroundColor: "var(--primary)20" }}
          />
        </div>

        {/* Pending */}
        <div
          className="rounded-2xl border p-5 relative overflow-hidden"
          style={{
            backgroundColor:
              pendingCount > 0 ? "#f59e0b0d" : "var(--dash-card)",
            borderColor: pendingCount > 0 ? "#f59e0b30" : "var(--dash-border)",
          }}
        >
          <p
            className="text-[10px] font-black uppercase tracking-widest mb-2"
            style={{
              color: pendingCount > 0 ? "#f59e0b" : "var(--text-subtle)",
            }}
          >
            Do potwierdzenia
          </p>
          <div className="flex items-end gap-3">
            <p className="text-4xl font-black text-text">{pendingCount}</p>
            <p className="text-sm text-text-muted mb-1">oczekujące</p>
          </div>
          <p
            className="text-xs mt-2"
            style={{
              color: pendingCount > 0 ? "#f59e0b" : "var(--text-subtle)",
            }}
          >
            {pendingCount > 0
              ? "Wymaga Twojej decyzji"
              : "Wszystkie potwierdzone"}
          </p>
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{
              backgroundColor:
                pendingCount > 0 ? "#f59e0b40" : "var(--primary)20",
            }}
          />
        </div>

        {/* Accepted */}
        <div
          className="rounded-2xl border p-5 relative overflow-hidden"
          style={{
            backgroundColor: "var(--dash-card)",
            borderColor: "var(--dash-border)",
          }}
        >
          <p className="text-[10px] font-black uppercase tracking-widest text-text-subtle mb-2">
            Zaakceptowane
          </p>
          <div className="flex items-end gap-3">
            <p className="text-4xl font-black text-text">{acceptedCount}</p>
            <p className="text-sm text-text-muted mb-1">potwierdzone</p>
          </div>
          <p className="text-xs text-emerald-500 flex items-center gap-1 mt-2">
            <Check className="w-3 h-3" />
            Gotowe do realizacji
          </p>
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{ backgroundColor: "#22c55e20" }}
          />
        </div>
      </div>

      {/* Layout for Table and Calendar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Appointments table */}
        <div
          className="xl:col-span-2 rounded-2xl border overflow-hidden flex flex-col"
          style={{
            backgroundColor: "var(--dash-card)",
            borderColor: "var(--dash-border)",
          }}
        >
          <div
            className="px-5 py-4 border-b flex items-center justify-between"
            style={{ borderColor: "var(--dash-border)" }}
          >
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-bold text-text">
                {filteredDay !== null
                  ? `Wizyty w dniu ${filteredDay}`
                  : "Nadchodzące Wizyty"}
              </h3>
              {filteredDay !== null && (
                <button
                  onClick={() => setFilteredDay(null)}
                  className="text-[10px] text-text-muted hover:text-text hover:bg-bg-alt px-2 py-1 rounded-lg border transition-colors font-bold flex items-center gap-1"
                  style={{
                    borderColor: "var(--dash-border)",
                    backgroundColor: "var(--dash-card)",
                  }}
                >
                  <X className="w-3 h-3" /> WYCZYŚĆ FILTR
                </button>
              )}
            </div>
            {pendingCount > 0 && filteredDay === null && (
              <span
                className="text-[10px] font-black px-2.5 py-1 rounded-full text-white"
                style={{ backgroundColor: "#f59e0b" }}
              >
                {pendingCount} oczekujące
              </span>
            )}
          </div>

          {displayedReservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 flex-1">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "var(--primary)10" }}
              >
                <Calendar
                  className="w-6 h-6"
                  style={{ color: "var(--primary)" }}
                />
              </div>
              <p className="text-sm font-bold text-text">
                {filteredDay !== null
                  ? "Brak rezerwacji na ten dzień"
                  : "Brak rezerwacji"}
              </p>
              <p className="text-xs text-text-muted text-center max-w-xs">
                Gdy klient złoży rezerwację przez Twój widget, pojawi się tutaj.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--dash-border)" }}>
                    {[
                      "Klient",
                      "Data i godzina",
                      "Telefon",
                      "Wartość",
                      "Status",
                      "Akcje",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-black uppercase tracking-widest text-text-subtle px-4 py-2.5 first:px-5 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayedReservations.map((res) => (
                    <ReservationRow key={res.id} res={res} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Mini Calendar */}
        <div className="xl:col-span-1">
          <MiniCalendar
            reservations={reservations}
            onSeeAll={(day) => setFilteredDay(day)}
          />
        </div>
      </div>
    </div>
  );
}
