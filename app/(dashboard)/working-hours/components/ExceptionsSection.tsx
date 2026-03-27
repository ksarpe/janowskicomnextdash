"use client";

import { CalendarOff } from "lucide-react";
import { ExceptionRow } from "./ExceptionRow";
import { AddExceptionForm } from "./AddExceptionForm";

interface Exception {
  id: string;
  date: string;
  allDay: boolean;
  startTime: string | null;
  endTime: string | null;
  label: string;
}

interface ExceptionsSectionProps {
  exceptions: Exception[];
  exceptionForm: {
    date: string;
    allDay: boolean;
    startTime: string;
    endTime: string;
  };
  setExceptionForm: (form: any) => void;
  handleAddException: (e: React.SubmitEvent) => Promise<void>;
  handleDeleteException: (id: string) => Promise<void>;
  isSubmittingException: boolean;
}

export function ExceptionsSection({
  exceptions,
  exceptionForm,
  setExceptionForm,
  handleAddException,
  handleDeleteException,
  isSubmittingException,
}: ExceptionsSectionProps) {
  return (
    <section className="col-span-3">
      <h2 className="text-lg font-bold text-text flex items-center gap-2 mb-4">
        Wyjątki i urlopy
      </h2>
      <div className="space-y-8">
        <AddExceptionForm
          exceptionForm={exceptionForm}
          setExceptionForm={setExceptionForm}
          handleAddException={handleAddException}
          isSubmittingException={isSubmittingException}
        />

        {/* List of exceptions */}
        <div>
          <h3 className="text-sm font-bold text-text mb-2 px-1">
            Dodane wyjątki
          </h3>
          <div className="border border-dash-border rounded-sm">
            {exceptions.length === 0 && (
              <div className="p-10 flex flex-col items-center justify-center gap-3 text-text-muted border border-dashed border-dash-border rounded-sm bg-dash-card/30">
                <CalendarOff className="w-8 h-8 opacity-20" />
                <p className="text-sm font-medium">Brak dodanych wyjątków.</p>
              </div>
            )}
            {exceptions.map((ex) => (
              <ExceptionRow
                key={ex.id}
                exception={ex}
                handleDeleteException={handleDeleteException}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
