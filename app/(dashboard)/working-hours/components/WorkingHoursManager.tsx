"use client";

import React, { useState } from "react";
import { Clock, CalendarOff, Save, Trash, Plus, Check } from "lucide-react";
import {
  updateWorkingHours,
  addBlockedTime,
  deleteBlockedTime,
} from "@/app/api/widget/booking/actions";
import { DayRow } from "./DayRow";
import { Button } from "@/components/ui/Button";

const DAYS_OF_WEEK = [
  { value: 1, label: "Poniedziałek" },
  { value: 2, label: "Wtorek" },
  { value: 3, label: "Środa" },
  { value: 4, label: "Czwartek" },
  { value: 5, label: "Piątek" },
  { value: 6, label: "Sobota" },
  { value: 0, label: "Niedziela" },
];

export default function WorkingHoursManager({
  initialHours,
  initialExceptions,
}: {
  initialHours: any[];
  initialExceptions: {
    id: string;
    date: string;
    allDay: boolean;
    startTime: string | null;
    endTime: string | null;
    label: string;
  }[];
}) {
  const [hours, setHours] = useState(
    DAYS_OF_WEEK.map((day) => {
      const found = initialHours.find((h) => h.dayOfWeek === day.value);
      return {
        dayOfWeek: day.value,
        label: day.label,
        startTime: found?.startTime || "08:00",
        endTime: found?.endTime || "16:00",
        isActive: found ? found.isActive : day.value > 0 && day.value < 6,
      };
    }),
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isSubmittingException, setIsSubmittingException] = useState(false);

  const [exceptions, setExceptions] = useState(initialExceptions);
  const [exceptionForm, setExceptionForm] = useState({
    date: "",
    allDay: true,
    startTime: "12:00",
    endTime: "14:00",
  });

  const handleDayChange = (dayOfWeek: number, field: string, value: any) => {
    setHours((prev) =>
      prev.map((h) =>
        h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h,
      ),
    );
  };

  const handleSaveSchedule = async () => {
    setIsSaving(true);
    try {
      await updateWorkingHours(
        hours.map(({ dayOfWeek, startTime, endTime, isActive }) => ({
          dayOfWeek,
          startTime,
          endTime,
          isActive,
        })),
      );
      alert("Grafik został zapisany!");
    } catch (e) {
      console.error(e);
      alert("Wystąpił błąd podczas zapisywania.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddException = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exceptionForm.date || isSubmittingException) return;

    setIsSubmittingException(true);
    try {
      const res = await addBlockedTime({
        date: exceptionForm.date,
        allDay: exceptionForm.allDay,
        startTime: exceptionForm.startTime,
        endTime: exceptionForm.endTime,
      });

      if (res.success && res.exception) {
        const dateObj = new Date(exceptionForm.date);
        const dateStr = dateObj.toLocaleDateString("pl-PL", {
          day: "numeric",
          month: "long",
        });
        const label = exceptionForm.allDay
          ? `${dateStr} - Cały dzień`
          : `${dateStr} - Od ${exceptionForm.startTime} do ${exceptionForm.endTime}`;

        setExceptions(
          [
            ...exceptions,
            {
              id: res.exception.id,
              date: exceptionForm.date,
              allDay: exceptionForm.allDay,
              startTime: exceptionForm.startTime || null,
              endTime: exceptionForm.endTime || null,
              label,
            },
          ].sort((a, b) => a.date.localeCompare(b.date)),
        );

        setExceptionForm({
          date: "",
          allDay: true,
          startTime: "12:00",
          endTime: "14:00",
        });
      } else {
        alert(res.error || "Wystąpił błąd");
      }
    } catch (e) {
      console.error(e);
      alert("Wystąpił błąd");
    } finally {
      setIsSubmittingException(false);
    }
  };

  const handleDeleteException = async (id: string) => {
    try {
      const res = await deleteBlockedTime(id);
      if (res.success) {
        setExceptions(exceptions.filter((ex) => ex.id !== id));
      } else {
        alert(res.error || "Nie udało się usunąć blokady");
      }
    } catch (err) {
      console.error(err);
      alert("Wystąpił błąd serwera");
    }
  };

  return (
    <div className="h-full overflow-y-auto w-full">
      <div className="p-4 sm:p-6 lg:p-8 w-full mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-black text-text">Godziny pracy</h1>
          <p className="text-sm text-text-muted mt-1 max-w-2xl">
            Skonfiguruj standardowe godziny działania warsztatu i zarządzaj
            blokadami kalendarza w dni wolne lub urlopy.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12 items-start">
          <section>
            <h2 className="text-lg font-bold text-text flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-primary" />
              Stały grafik
            </h2>
            <div className="space-y-6">
              <div className="p-1 rounded-sm border border-dash-border bg-dash-card shadow-sm overflow-hidden">
                <div className="divide-y divide-dash-border flex flex-col">
                  {hours.map((day) => (
                    <DayRow
                      key={day.dayOfWeek}
                      day={day}
                      handleDayChange={handleDayChange}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-dash-border">
                <Button onClick={handleSaveSchedule} disabled={isSaving}>
                  <Save className="w-5 h-5 sm:w-4 sm:h-4" />
                  {isSaving ? "Zapisywanie..." : "Zapisz grafik"}
                </Button>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-text flex items-center gap-2 mb-6">
              <CalendarOff className="w-5 h-5 text-primary" />
              Wyjątki i urlopy
            </h2>
            <div className="space-y-8">
              <div
                className="bg-primary/10 p-5 rounded-sm border border-primary/20 text-sm font-medium leading-relaxed"
                style={{ color: "var(--primary-dark)" }}
              >
                <div className="flex items-start gap-3">
                  <CalendarOff
                    className="w-5 h-5 mt-0.5 shrink-0"
                    style={{ color: "var(--primary)" }}
                  />
                  <p>
                    Zablokuj dni, w których warsztat jest zamknięty (np. święta,
                    urlop) lub konkretne godziny, aby wyłączyć możliwość
                    rezerwacji w widżecie.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-text mb-2 px-1">
                  Dodane wyjątki
                </h3>
                {exceptions.length === 0 && (
                  <div className="p-10 flex flex-col items-center justify-center gap-3 text-text-muted border border-dashed border-dash-border rounded-3xl bg-dash-card/30">
                    <CalendarOff className="w-8 h-8 opacity-20" />
                    <p className="text-sm font-medium">
                      Brak dodanych wyjątków.
                    </p>
                  </div>
                )}
                {exceptions.map((ex) => (
                  <div
                    key={ex.id}
                    className="flex items-center justify-between p-4 sm:p-5 bg-dash-card border border-dash-border rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] transition-all"
                  >
                    <span className="font-bold text-text text-[15px] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
                        <CalendarOff className="w-4 h-4 text-primary" />
                      </div>
                      {ex.label}
                    </span>
                    <Button
                      onClick={() => handleDeleteException(ex.id)}
                      title="Usuń"
                    >
                      <Trash className="w-5 h-5 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <form
                onSubmit={handleAddException}
                className="p-5 sm:p-7 border border-dash-border bg-dash-card rounded-3xl shadow-sm flex flex-col gap-6 mt-4"
              >
                <div className="pb-4 border-b border-dash-border">
                  <h3 className="text-base font-bold text-text flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" />
                    Dodaj nowy wyjątek
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">
                      Data zablokowania *
                    </label>
                    <input
                      type="date"
                      required
                      value={exceptionForm.date}
                      onChange={(e) =>
                        setExceptionForm({
                          ...exceptionForm,
                          date: e.target.value,
                        })
                      }
                      className="w-full bg-dash-bg border border-dash-border rounded-sm px-4 py-3.5 text-base sm:text-sm font-medium focus:outline-none focus:border-primary text-text transition-colors focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="flex flex-col md:justify-center pt-2 md:pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group w-fit p-2 -ml-2 rounded-sm hover:bg-dash-bg transition-colors">
                      <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                        <input
                          type="checkbox"
                          checked={exceptionForm.allDay}
                          onChange={(e) =>
                            setExceptionForm({
                              ...exceptionForm,
                              allDay: e.target.checked,
                            })
                          }
                          className="peer sr-only"
                        />
                        <div className="w-6 h-6 border-[2.5px] border-dash-border rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all bg-dash-bg" />
                        <Check
                          className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                          strokeWidth={3}
                        />
                      </div>
                      <span className="text-[15px] font-bold text-text group-hover:text-primary transition-colors">
                        Cały dzień zablokowany
                      </span>
                    </label>
                  </div>
                </div>

                <div
                  className={`grid grid-cols-2 gap-4 transition-all duration-300 ease-in-out overflow-hidden bg-dash-bg/50 rounded-sm ${
                    exceptionForm.allDay
                      ? "max-h-0 opacity-0 pointer-events-none mt-0"
                      : "max-h-32 opacity-100 p-4 border border-dash-border mt-2"
                  }`}
                >
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">
                      Godzina od
                    </label>
                    <input
                      type="time"
                      value={exceptionForm.startTime}
                      onChange={(e) =>
                        setExceptionForm({
                          ...exceptionForm,
                          startTime: e.target.value,
                        })
                      }
                      className="w-full bg-dash-bg border border-dash-border rounded-sm px-3 py-3 text-base sm:text-sm font-bold text-center focus:outline-none focus:border-primary text-text transition-colors focus:ring-2 focus:ring-primary/20 shadow-sm"
                      disabled={exceptionForm.allDay}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">
                      Godzina do
                    </label>
                    <input
                      type="time"
                      value={exceptionForm.endTime}
                      onChange={(e) =>
                        setExceptionForm({
                          ...exceptionForm,
                          endTime: e.target.value,
                        })
                      }
                      className="w-full bg-dash-bg border border-dash-border rounded-sm px-3 py-3 text-base sm:text-sm font-bold text-center focus:outline-none focus:border-primary text-text transition-colors focus:ring-2 focus:ring-primary/20 shadow-sm"
                      disabled={exceptionForm.allDay}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-3 sm:pt-4">
                  <Button type="submit">
                    <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
                    Dodaj blokadę
                  </Button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
