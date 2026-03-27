"use client";

import { useState } from "react";
import { Plus, Check, ChevronDownIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

interface ExceptionForm {
  date: string;
  allDay: boolean;
  startTime: string;
  endTime: string;
}

interface AddExceptionFormProps {
  exceptionForm: ExceptionForm;
  setExceptionForm: (form: ExceptionForm) => void;
  handleAddException: (e: React.SubmitEvent) => Promise<void>;
  isSubmittingException: boolean;
}

export function AddExceptionForm({
  exceptionForm,
  setExceptionForm,
  handleAddException,
  isSubmittingException,
}: AddExceptionFormProps) {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  return (
    <form
      onSubmit={handleAddException}
      className="p-4 sm:p-5 border border-dash-border bg-dash-card rounded-sm shadow-sm mt-4"
    >
      <div className="flex flex-wrap items-center gap-3">
        {/* Date picker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!date}
              className="h-9 px-3 justify-between gap-2 text-sm font-normal data-[empty=true]:text-muted-foreground min-w-[160px]"
            >
              {date ? (
                format(date, "PPP", { locale: pl })
              ) : (
                <span>Wybierz datę</span>
              )}
              <ChevronDownIcon className="w-4 h-4 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selected) => {
                setDate(selected);
                setOpen(false);
                setExceptionForm({
                  ...exceptionForm,
                  date: selected ? format(selected, "yyyy-MM-dd") : "",
                });
              }}
              defaultMonth={date}
            />
          </PopoverContent>
        </Popover>

        {/* Divider */}
        <div className="h-5 w-px bg-dash-border hidden sm:block" />

        {/* All-day checkbox */}
        <label className="flex items-center gap-2 cursor-pointer group shrink-0">
          <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
            <input
              type="checkbox"
              checked={exceptionForm.allDay}
              onChange={(e) =>
                setExceptionForm({ ...exceptionForm, allDay: e.target.checked })
              }
              className="peer sr-only"
            />
            <div className="w-5 h-5 border-2 border-dash-border rounded peer-checked:bg-primary peer-checked:border-primary transition-all bg-dash-bg" />
            <Check
              className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              strokeWidth={3}
            />
          </div>
          <span className="text-sm font-semibold text-text group-hover:text-primary transition-colors whitespace-nowrap">
            Cały dzień
          </span>
        </label>

        {/* Time inputs — slide in when allDay is off */}
        <div
          className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ease-in-out ${
            exceptionForm.allDay
              ? "max-w-0 opacity-0 pointer-events-none"
              : "max-w-xs opacity-100"
          }`}
        >
          <div className="h-5 w-px bg-dash-border shrink-0" />
          <Input
            type="time"
            value={exceptionForm.startTime}
            onChange={(e) =>
              setExceptionForm({ ...exceptionForm, startTime: e.target.value })
            }
            className="bg-primary [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            disabled={exceptionForm.allDay}
          />
          <span className="text-text-muted font-bold px-1">-</span>
          <Input
            type="time"
            value={exceptionForm.endTime}
            onChange={(e) =>
              setExceptionForm({ ...exceptionForm, endTime: e.target.value })
            }
            className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            disabled={exceptionForm.allDay}
          />
        </div>

        {/* Submit — pushed to right on larger screens */}
        <div className="sm:ml-auto">
          <Button type="submit" disabled={isSubmittingException} size="sm">
            <Plus className="w-4 h-4" />
            {isSubmittingException ? "Dodawanie..." : "Dodaj blokadę"}
          </Button>
        </div>
      </div>
    </form>
  );
}
