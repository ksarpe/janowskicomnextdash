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
      className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-dash-bg focus-within:bg-dash-bg group"
    >
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <label className="relative inline-flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={day.isActive}
            onChange={(e) =>
              handleDayChange(day.dayOfWeek, "isActive", e.target.checked)
            }
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-black/5" />
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
        <input
          type="time"
          value={day.startTime}
          onChange={(e) =>
            handleDayChange(day.dayOfWeek, "startTime", e.target.value)
          }
          className="flex-1 sm:flex-none w-full sm:w-[130px] border border-dash-border bg-dash-bg text-text rounded-sm px-4 py-3 sm:py-2.5 text-base sm:text-sm font-semibold text-center focus:outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
          disabled={!day.isActive}
        />
        <span className="text-text-muted font-bold px-1 sm:px-2">-</span>
        <input
          type="time"
          value={day.endTime}
          onChange={(e) =>
            handleDayChange(day.dayOfWeek, "endTime", e.target.value)
          }
          className="flex-1 sm:flex-none w-full sm:w-[130px] border border-dash-border bg-dash-bg text-text rounded-sm px-4 py-3 sm:py-2.5 text-base sm:text-sm font-semibold text-center focus:outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
          disabled={!day.isActive}
        />
      </div>
    </div>
  );
}
