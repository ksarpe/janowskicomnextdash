import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getMinutesFromTime } from "@/utils/helpers";

export async function ScheduleBox() {
  const session = await auth();
  const clientId = session?.user?.id;

  if (!clientId) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // 1. Fetch Working Hours
  const workingHours = await prisma.workingHours.findUnique({
    where: {
      clientId_dayOfWeek: {
        clientId,
        dayOfWeek,
      },
    },
  });

  // 2. Fetch Appointments for today
  const appointments = await prisma.appointment.findMany({
    where: {
      clientId,
      date: {
        gte: today,
        lt: tomorrow,
      },
      status: {
        not: "CANCELLED",
      },
    },
    include: {
      service: true,
    },
  });

  // Check if it's a workday
  const isWorkDay =
    workingHours?.isActive && workingHours.startTime && workingHours.endTime;

  // Calculate busy minutes
  const busyMinutes = appointments.reduce((acc, appt) => {
    return acc + (appt.service?.duration || 0);
  }, 0);

  // Calculate total working minutes
  let totalWorkMinutes = 0;
  if (isWorkDay) {
    const startMins = getMinutesFromTime(workingHours.startTime);
    const endMins = getMinutesFromTime(workingHours.endTime);
    // Handle edge case if end < start
    totalWorkMinutes = Math.max(0, endMins - startMins);
  }

  // Free minutes
  const freeMinutes = Math.max(0, totalWorkMinutes - busyMinutes);

  const formatHours = (mins: number) => {
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    if (hrs > 0 && m > 0) return `${hrs}h ${m}m`;
    if (hrs > 0) return `${hrs}h`;
    if (m > 0) return `${m}m`;
    return `0h`;
  };

  const busyHoursFormatted = formatHours(busyMinutes);
  const freeHoursFormatted = formatHours(freeMinutes);

  // Prepare next appointment text
  let nextUpText = "Brak kolejnych wizyt.";
  if (appointments.length > 0) {
    const now = new Date();
    const currentHour = now.getHours().toString().padStart(2, "0");
    const currentMinute = now.getMinutes().toString().padStart(2, "0");
    const safeNowStr = `${currentHour}:${currentMinute}`;

    const upcoming = appointments
      .filter((a) => a.startTime >= safeNowStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    if (upcoming.length > 0) {
      nextUpText = `${upcoming[0].startTime} – ${upcoming[0].service?.name || "Wizyta"}`;
    } else {
      nextUpText = "Wszystkie z dzisiejszych wizyt zakończone.";
    }
  }

  // Calculate progress percentage
  const progressPercent =
    totalWorkMinutes > 0
      ? Math.min(100, (busyMinutes / totalWorkMinutes) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-5 h-full min-h-[300px]">
      <div
        className="rounded-sm border flex-1 flex flex-col overflow-hidden"
        style={{
          backgroundColor: "var(--dash-card)",
          borderColor: "var(--dash-border)",
        }}
      >
        <div
          className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--dash-border)" }}
        >
          <h3 className="text-sm font-bold text-text flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Dzisiejszy harmonogram
          </h3>
          <Link
            href="/appointments"
            className="text-[10px] font-bold px-3 py-1.5 rounded-sm border transition-colors hover:opacity-80 uppercase tracking-wider text-text-muted"
            style={{
              borderColor: "var(--dash-border)",
              backgroundColor: "var(--bg-alt)",
            }}
          >
            Wizyty
          </Link>
        </div>

        <div className="px-5 py-6 flex-1 flex flex-col justify-center">
          {!isWorkDay ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-80 min-h-[180px]">
              <div
                className="w-12 h-12 mb-3 rounded-sm flex items-center justify-center"
                style={{
                  backgroundColor: "var(--bg-alt)",
                  color: "var(--text-muted)",
                }}
              >
                <Calendar className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold text-text">Dziś nie pracujesz</p>
              <p className="text-[11px] text-text-subtle mt-0.5 max-w-[180px]">
                Odpocznij i nabierz sił na kolejne dni.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Następna wizyta */}
              <div
                className="rounded-sm p-4 border"
                style={{
                  backgroundColor: "var(--bg-alt)",
                  borderColor: "var(--dash-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-[11px] uppercase tracking-wider font-bold text-text-muted">
                    Aktualnie / Następnie
                  </span>
                </div>
                <p className="text-sm font-bold text-text mt-2">{nextUpText}</p>
              </div>

              {/* Statystyki: Wizyty, Zajęty, Wolny czas */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div
                  className="p-3 rounded-sm border flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: "var(--dash-bg)",
                    borderColor: "var(--dash-border)",
                  }}
                >
                  <span className="text-lg font-bold text-text mb-0.5">
                    {appointments.length}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold">
                    Wizyty
                  </span>
                </div>
                <div
                  className="p-3 rounded-sm border flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: "var(--dash-bg)",
                    borderColor: "var(--dash-border)",
                  }}
                >
                  <span className="text-lg font-bold text-text mb-0.5">
                    {busyHoursFormatted}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold">
                    Zajęte
                  </span>
                </div>
                <div
                  className="p-3 rounded-sm border flex flex-col items-center justify-center"
                  style={{
                    backgroundColor: "var(--dash-bg)",
                    borderColor: "var(--dash-border)",
                  }}
                >
                  <span className="text-lg font-bold text-text mb-0.5">
                    {freeHoursFormatted}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-text-muted font-bold">
                    Wolne
                  </span>
                </div>
              </div>

              {/* Obciążenie dnia (Pasek postępu) */}
              <div className="mt-1">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[11px] font-bold text-text-subtle uppercase tracking-wider">
                    Obciążenie dnia
                  </span>
                  <span className="text-xs font-bold text-primary">
                    {Math.round(progressPercent)}%
                  </span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: "var(--dash-border)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: "var(--primary)",
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-bold text-text-muted">
                  <span>{workingHours?.startTime}</span>
                  <span>{workingHours?.endTime}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
