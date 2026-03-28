"use client";

import { CalendarOff, Info } from "lucide-react";
import { ExceptionRow } from "./ExceptionRow";
import { AddExceptionForm } from "./AddExceptionForm";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoTooltip } from "@/components/ui/utils/info-tooltip";

interface Exception {
  id: string;
  date: string;
  allDay: boolean;
  startTime: string | null;
  endTime: string | null;
  label: string;
  title: string | null;
}

interface ExceptionsSectionProps {
  exceptions: Exception[];
  exceptionForm: {
    date: string;
    allDay: boolean;
    startTime: string;
    endTime: string;
    title: string;
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
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-lg font-bold text-text">Wyjątki i urlopy</h2>
        <InfoTooltip text="Dodając wyjątek, blokujesz możliwość rezerwacji na dany dzień lub przedział godzinowy. Jest to idealne rozwiązanie do oznaczania dni wolnych, urlopów czy świąt." />
      </div>
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
    </section>
  );
}
