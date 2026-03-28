"use client";

import { useState } from "react";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
} from "date-fns";
import { pl } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { CalendarIcon, Download } from "lucide-react";

type Preset = "last7days" | "lastMonth" | "prevMonth" | "lastYear" | "custom";

export default function StatsManager() {
  const [preset, setPreset] = useState<Preset>("last7days");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const getLabel = () => {
    switch (preset) {
      case "last7days":
        return "Ostatni tydzień";
      case "lastMonth":
        return "Ten miesiąc";
      case "prevMonth":
        return "Poprzedni miesiąc";
      case "lastYear":
        return "Ostatni rok";
      case "custom":
        if (date?.from) {
          if (date.to) {
            return `${format(date.from, "d MMM yyyy", { locale: pl })} - ${format(date.to, "d MMM yyyy", { locale: pl })}`;
          }
          return format(date.from, "d MMM yyyy", { locale: pl });
        }
        return "Wybierz datę";
    }
  };

  const setPresetRange = (p: Preset) => {
    setPreset(p);
    const today = new Date();

    if (p === "last7days") {
      setDate({ from: subDays(today, 7), to: today });
    } else if (p === "lastMonth") {
      setDate({ from: startOfMonth(today), to: endOfMonth(today) });
    } else if (p === "prevMonth") {
      const prev = subMonths(today, 1);
      setDate({ from: startOfMonth(prev), to: endOfMonth(prev) });
    } else if (p === "lastYear") {
      setDate({ from: startOfYear(today), to: endOfYear(today) });
    } else if (p === "custom") {
      setIsPopoverOpen(true);
    }
  };

  const MainButton = (
    <Button
      variant="outline"
      className="justify-start font-normal transition-all"
    >
      <CalendarIcon className="w-4 h-4 text-text-muted" />
      {getLabel()}
    </Button>
  );

  return (
    <div className="flex justify-between items-start md:items-center mb-6 flex-col md:flex-row gap-4">
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold text-text">Statystyki</h1>
        </div>
        <p className="text-sm text-text-muted font-medium">
          Śledź swoje zarobki i najczęściej wybierane usługi.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {preset === "custom" ? (
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>{MainButton}</PopoverTrigger>
            <PopoverContent className="w-auto p-0 shadow-sm" align="end">
              <CalendarUI
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                locale={pl}
                className="bg-dash-bg"
              />
              <div className="p-3 border-t border-dash-border flex justify-end gap-2 bg-dash-card/50">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPresetRange("last7days")}
                >
                  Wyczyść
                </Button>
                <Button size="sm" onClick={() => setIsPopoverOpen(false)}>
                  Zastosuj ten zakres
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>{MainButton}</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setPresetRange("last7days")}>
                Ostatni tydzień
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPresetRange("lastMonth")}>
                Ten miesiąc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPresetRange("prevMonth")}>
                Poprzedni miesiąc
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPresetRange("lastYear")}>
                Ostatni rok
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setPresetRange("custom")}>
                Własny zakres...
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <Button variant="default" className="shadow-sm">
          <Download className="w-4 h-4  opacity-80" />
          Eksportuj raport
        </Button>
      </div>
    </div>
  );
}
