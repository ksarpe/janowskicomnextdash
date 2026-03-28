"use client";

import React from "react";
import { Clock, Save } from "lucide-react";
import { DayRow } from "./DayRow";
import { Button } from "@/components/ui/Button";
import { InfoTooltip } from "@/components/ui/utils/info-tooltip";

interface WorkingHour {
  dayOfWeek: number;
  label: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface StandardScheduleSectionProps {
  hours: WorkingHour[];
  handleDayChange: (dayOfWeek: number, field: string, value: any) => void;
  handleSaveSchedule: () => Promise<void>;
  isSaving: boolean;
  hasChanges?: boolean;
}

export function StandardScheduleSection({
  hours,
  handleDayChange,
  handleSaveSchedule,
  isSaving,
  hasChanges = false,
}: StandardScheduleSectionProps) {
  return (
    <section className="col-span-2">
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-bold text-text">Stały grafik</h2>
        <InfoTooltip text="Tutaj możesz ustawić standardowe godziny otwarcia dla każdego dnia tygodnia. Zaznacz dni, w które jesteś dostępny i określ godziny rozpoczęcia oraz zakończenia pracy. Pamiętaj, że zmiany tutaj będą obowiązywać każdego tygodnia, chyba że zostaną nadpisane przez wyjątki." />
      </div>
      <div>
        <div className={`p-1 rounded-sm border bg-dash-card shadow-sm overflow-hidden transition-all duration-300 ${hasChanges ? "border-orange-500/50 shadow-orange-500/10 shadow-lg ring-1 ring-orange-500/30" : "border-dash-border"}`}>
          <div className="divide-y divide-dash-border flex flex-col">
            {hours.map((day) => (
              <DayRow
                key={day.dayOfWeek}
                day={day}
                handleDayChange={handleDayChange}
              />
            ))}
          </div>
          <div className="text-end p-2 flex justify-between items-center border-t border-dash-border/40 mt-1">
            {hasChanges ? (
              <div className="flex items-center gap-2 px-2 text-orange-500 text-sm font-semibold animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Niezapisane zmiany
              </div>
            ) : (
              <span className="text-sm text-text-muted px-2 opacity-50">Zapisano</span>
            )}
            <Button
              className={`transition-all duration-300 ${hasChanges ? "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20" : ""}`}
              onClick={handleSaveSchedule}
              disabled={isSaving || !hasChanges}
            >
              <Save className="w-5 h-5 sm:w-4 sm:h-4" />
              {isSaving ? "Zapisywanie..." : "Zapisz grafik"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
