"use client";

import React, { useState } from "react";
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
        <div className="grid lg:grid-cols-5 gap-8 xl:gap-12 items-start">
          <StandardScheduleSection
            hours={hours}
            handleDayChange={handleDayChange}
            handleSaveSchedule={handleSaveSchedule}
            isSaving={isSaving}
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
    </div>
  );
}
