"use client";

import React from "react";
import { Clock, Save } from "lucide-react";
import { DayRow } from "./DayRow";
import { Button } from "@/components/ui/Button";

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
}

export function StandardScheduleSection({
  hours,
  handleDayChange,
  handleSaveSchedule,
  isSaving,
}: StandardScheduleSectionProps) {
  return (
    <section className="col-span-2">
      <h2 className="text-lg font-bold text-text flex items-center gap-2 mb-4">
        Stały grafik
      </h2>
      <div>
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
          <div className="text-end p-2">
            <Button
              className="mt-4"
              onClick={handleSaveSchedule}
              disabled={isSaving}
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
