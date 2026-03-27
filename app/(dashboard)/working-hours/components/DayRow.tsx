import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export function DayRow({
  day,
  handleDayChange,
}: {
  day: any;
  handleDayChange: (dayOfWeek: number, field: string, value: any) => void;
}) {
  return (
    <div
      key={day.dayOfWeek}
      className="px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-dash-bg focus-within:bg-dash-bg group"
    >
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <Switch
            checked={day.isActive}
            onCheckedChange={(checked) =>
              handleDayChange(day.dayOfWeek, "isActive", checked)
            }
          />
        </label>
        <span
          className={`font-bold sm:w-32 text-base ${day.isActive ? "text-text" : "text-text-muted opacity-60"}`}
        >
          {day.label}
        </span>
      </div>

      <div
        className={`flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto transition-all duration-300 mt-2 sm:mt-0 ${day.isActive ? "opacity-100" : "opacity-0 pointer-events-none scale-95 sm:scale-100 origin-left"}`}
      >
        <Input
          type="time"
          value={day.startTime}
          onChange={(e) =>
            handleDayChange(day.dayOfWeek, "startTime", e.target.value)
          }
          className="bg-primary [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          disabled={!day.isActive}
        />
        <span className="text-text-muted font-bold px-1 sm:px-2">-</span>
        <Input
          type="time"
          value={day.endTime}
          onChange={(e) =>
            handleDayChange(day.dayOfWeek, "endTime", e.target.value)
          }
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          disabled={!day.isActive}
        />
      </div>
    </div>
  );
}
