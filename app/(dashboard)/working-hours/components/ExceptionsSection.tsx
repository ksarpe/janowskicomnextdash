"use client";

import { useState } from "react";
import { CalendarOff, Plus, Check, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

import { ExceptionRow } from "./ExceptionRow";

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
  handleAddException: (e: React.FormEvent) => Promise<void>;
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
  const [date, setDate] = useState<Date>();

  return (
    <section className="col-span-3">
      <h2 className="text-lg font-bold text-text flex items-center gap-2 mb-6">
        Wyjątki i urlopy
      </h2>
      <div className="space-y-8">
        <div
          className="bg-primary/10 p-5 rounded-sm border border-primary/20 text-sm font-medium leading-relaxed"
          style={{ color: "var(--primary-dark)" }}
        >
          <div className="flex items-start gap-3">
            <p>
              Zablokuj dni, w których warsztat jest zamknięty (np. święta,
              urlop) lub konkretne godziny, aby wyłączyć możliwość rezerwacji w
              widżecie.
            </p>
          </div>
        </div>
        <form
          onSubmit={handleAddException}
          className="p-5 sm:p-7 border border-dash-border bg-dash-card rounded-sm shadow-sm flex flex-col gap-6 mt-4"
        >
          <div className="pb-4 border-b border-dash-border">
            <h3 className="text-base font-bold text-text flex items-center gap-2">
              <Plus className="w-4 h-4 text-primary" />
              Dodaj nowy wyjątek
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    data-empty={!date}
                    className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                  >
                    {date ? (
                      format(date, "PPP", { locale: pl })
                    ) : (
                      <span>Wybierz datę</span>
                    )}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      setDate(date);
                      setExceptionForm({
                        ...exceptionForm,
                        date: date?.toISOString().split("T")[0] || "",
                      });
                    }}
                    defaultMonth={date}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col md:justify-center">
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
              <Input
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

          <div className="text-end">
            <Button type="submit" disabled={isSubmittingException}>
              <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
              {isSubmittingException ? "Dodawanie..." : "Dodaj blokadę"}
            </Button>
          </div>
        </form>
        {/* List of exceptions */}
        <div className="space-y-4">
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
