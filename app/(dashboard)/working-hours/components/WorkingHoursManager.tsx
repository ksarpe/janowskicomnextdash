"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  updateWorkingHours,
  addBlockedTime,
  deleteBlockedTime,
} from "@/app/api/widget/booking/actions";
import { StandardScheduleSection } from "./StandardScheduleSection";
import { ExceptionsSection } from "./ExceptionsSection";

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
    title: string | null;
  }[];
}) {
  const initialMappedHours = DAYS_OF_WEEK.map((day) => {
    const found = initialHours.find((h) => h.dayOfWeek === day.value);
    return {
      dayOfWeek: day.value,
      label: day.label,
      startTime: found?.startTime || "08:00",
      endTime: found?.endTime || "16:00",
      isActive: found ? found.isActive : day.value > 0 && day.value < 6,
    };
  });

  const [initialHoursState, setInitialHoursState] = useState(initialMappedHours);
  const [hours, setHours] = useState(initialMappedHours);

  const hasChanges = JSON.stringify(hours) !== JSON.stringify(initialHoursState);

  const [isSaving, setIsSaving] = useState(false);
  const [isSubmittingException, setIsSubmittingException] = useState(false);

  const [exceptions, setExceptions] = useState(initialExceptions);
  const [exceptionForm, setExceptionForm] = useState({
    date: "",
    allDay: true,
    startTime: "12:00",
    endTime: "14:00",
    title: "",
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
      setInitialHoursState(hours);
      toast.success("Grafik został zapisany!");
    } catch (e) {
      console.error(e);
      toast.error("Wystąpił błąd podczas zapisywania.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddException = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!exceptionForm.date || isSubmittingException) return;

    setIsSubmittingException(true);
    try {
      const res = await addBlockedTime({
        date: exceptionForm.date,
        allDay: exceptionForm.allDay,
        startTime: exceptionForm.startTime,
        endTime: exceptionForm.endTime,
        title: exceptionForm.title,
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
              title: exceptionForm.title || null,
            },
          ].sort((a, b) => a.date.localeCompare(b.date)),
        );

        setExceptionForm({
          date: "",
          allDay: true,
          startTime: "12:00",
          endTime: "14:00",
          title: "",
        });
      } else {
        toast.error(res.error || "Wystąpił błąd");
      }
    } catch (e) {
      console.error(e);
      toast.error("Wystąpił błąd");
    } finally {
      setIsSubmittingException(false);
    }
  };

  const handleDeleteException = async (id: string) => {
    try {
      const res = await deleteBlockedTime(id);
      if (res.success) {
        setExceptions(exceptions.filter((ex) => ex.id !== id));
        toast.success("Wyjątek został usunięty");
      } else {
        toast.error(res.error || "Nie udało się usunąć blokady");
      }
    } catch (err) {
      console.error(err);
      toast.error("Wystąpił błąd serwera");
    }
  };

  return (
    // Main container
    <div className="p-4 sm:p-6 lg:p-8 w-full mx-auto h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col items-start gap-3 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-text">Grafik</h1>
          {/* {isPending && (
              <Loader2 className="w-5 h-5 text-text-muted animate-spin" />
            )} */}
        </div>
        <p className="text-sm text-text-muted text-medium">
          Ustaw dni i godziny otwarcia oraz dodawaj wyjątki od grafiku.
        </p>
      </div>
      {/* Both sections */}
      <div className="grid lg:grid-cols-5 gap-8 xl:gap-12 items-start">
        <StandardScheduleSection
          hours={hours}
          handleDayChange={handleDayChange}
          handleSaveSchedule={handleSaveSchedule}
          isSaving={isSaving}
          hasChanges={hasChanges}
        />
        <ExceptionsSection
          exceptions={exceptions}
          exceptionForm={exceptionForm}
          setExceptionForm={setExceptionForm}
          handleAddException={handleAddException}
          handleDeleteException={handleDeleteException}
          isSubmittingException={isSubmittingException}
        />
      </div>
    </div>
  );
}
