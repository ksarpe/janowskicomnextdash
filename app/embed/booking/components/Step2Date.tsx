import React, { useState } from "react";
import { ChevronRight, Calendar, ChevronLeft } from "lucide-react";
import { getAvailableTimes, isDayAvailable } from "../bookingUtils";

interface Step2DateProps {
  themeColor: string;
  selectedService: any;
  workingHours: any[];
  blockedTimes: any[];
  appointments: any[];
  onNext: (dateStr: string, dateObj: Date, time: string) => void;
}

export function Step2Date({
  themeColor,
  selectedService,
  workingHours,
  blockedTimes,
  appointments,
  onNext,
}: Step2DateProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const calendarMonth = currentMonth.getMonth();
  const daysInMonth = new Date(year, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, calendarMonth, 1).getDay();
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Quick Dates Logic
  const quickDates = [];
  let dayOffset = 0;

  while (quickDates.length < 3 && dayOffset < 30) {
    const d = new Date(today);
    d.setDate(today.getDate() + dayOffset);
    if (
      isDayAvailable(
        d,
        workingHours,
        blockedTimes,
        appointments,
        selectedService?.duration,
      )
    ) {
      let label = d.toLocaleDateString("pl-PL", { weekday: "short" });

      const diffTime = d.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
      if (diffDays === 0) label = "Dziś";
      else if (diffDays === 1) label = "Jutro";
      else if (diffDays === 2) label = "Pojutrze";

      const dateStr = d.toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "short",
      });
      quickDates.push({ label, dateStr, d });
    }
    dayOffset++;
  }

  const handlePrevMonth = () =>
    setCurrentMonth(new Date(year, calendarMonth - 1, 1));
  const handleNextMonth = () =>
    setCurrentMonth(new Date(year, calendarMonth + 1, 1));

  const availableTimes =
    selectedDateObj && selectedService
      ? getAvailableTimes(
          selectedDateObj,
          selectedService.duration,
          workingHours,
          blockedTimes,
          appointments,
        )
      : [];

  return (
    <div className="animate-in slide-in-from-right-8 fade-in duration-300 pb-8">
      <p className="text-sm font-semibold text-gray-900 mb-3">Wybierz datę</p>

      {!showFullCalendar ? (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-5 px-5 snap-x hide-scrollbar">
          {quickDates.map((q) => {
            const isSelected = selectedDate === q.dateStr;
            return (
              <button
                key={q.dateStr}
                onClick={() => {
                  setSelectedDate(q.dateStr);
                  setSelectedDateObj(q.d);
                  setSelectedTime(null);
                }}
                className={`shrink-0 flex flex-col items-center justify-center w-[84px] h-[84px] rounded-sm border transition-all snap-start ${
                  isSelected
                    ? "border-transparent text-white shadow-md transform scale-105"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
                style={isSelected ? { backgroundColor: themeColor } : {}}
              >
                <span
                  className={`text-xs mb-1 ${isSelected ? "text-white/80" : "text-gray-400"}`}
                >
                  {q.label}
                </span>
                <span className="font-bold text-lg">{q.d.getDate()}</span>
                <span
                  className={`text-xs ${isSelected ? "text-white/80" : "text-gray-500"}`}
                >
                  {q.d.toLocaleDateString("pl-PL", { month: "short" })}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setShowFullCalendar(true)}
            className="shrink-0 flex flex-col items-center justify-center w-[84px] h-[84px] rounded-sm border border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-all snap-start"
          >
            <Calendar className="w-5 h-5 mb-1 text-gray-400" />
            <span className="text-[10px] font-semibold text-center px-1 leading-tight tracking-wide">
              CAŁY
              <br />
              KALENDARZ
            </span>
          </button>
        </div>
      ) : (
        <div className="bg-white border text-gray-900 border-gray-200 rounded-sm p-4 shadow-sm mb-6 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-sm text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="font-semibold text-sm capitalize">
              {currentMonth.toLocaleDateString("pl-PL", {
                month: "long",
                year: "numeric",
              })}
            </div>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-sm text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Pn", "Wt", "Śr", "Cz", "Pt", "Sb", "Nd"].map((day) => (
              <div
                key={day}
                className="text-[10px] font-bold text-gray-400 uppercase"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateObj = new Date(year, calendarMonth, day);

              // Sprawdzamy dostępność także po czasie dla DZIŚ!
              const isAvailable = isDayAvailable(
                dateObj,
                workingHours,
                blockedTimes,
                appointments,
                selectedService?.duration,
              );

              const dateStr = dateObj.toLocaleDateString("pl-PL", {
                day: "numeric",
                month: "short",
              });
              const isSelected = selectedDate === dateStr;
              const isToday = dateObj.getTime() === today.getTime();

              return (
                <button
                  key={day}
                  disabled={!isAvailable}
                  onClick={() => {
                    setSelectedDate(dateStr);
                    setSelectedDateObj(dateObj);
                    setSelectedTime(null);
                  }}
                  className={`
                    aspect-square flex items-center justify-center rounded-sm text-sm transition-all
                    ${!isAvailable ? "text-gray-300 cursor-not-allowed bg-gray-50/50 opacity-50 pointer-events-none" : "hover:bg-gray-100 text-gray-700"}
                    ${isSelected ? "text-white! font-bold shadow-md transform scale-105" : ""}
                    ${isToday && !isSelected && isAvailable ? "font-bold text-gray-900 border-2" : ""}
                  `}
                  style={
                    isSelected
                      ? { backgroundColor: themeColor }
                      : isToday && !isSelected && isAvailable
                        ? { borderColor: themeColor }
                        : {}
                  }
                >
                  {day}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setShowFullCalendar(false)}
            className="w-full mt-4 flex items-center justify-center py-2 text-[10px] font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors uppercase tracking-widest bg-gray-50 rounded-sm"
          >
            Zwiń kalendarz
          </button>
        </div>
      )}

      {/* Dostępne Godziny */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          selectedDate
            ? "opacity-100 max-h-[500px]"
            : "opacity-0 max-h-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-900">
            Dostępne godziny
          </p>
          <span className="text-xs text-gray-500 font-medium">
            {selectedDate}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {availableTimes.length > 0 ? (
            availableTimes.map((time) => {
              return (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`
                    py-3 rounded-sm border text-sm font-semibold transition-all
                    ${
                      selectedTime === time
                        ? "text-white shadow-md transform scale-105 border-transparent"
                        : "bg-white text-gray-700 hover:border-gray-400 border-gray-200 shadow-sm"
                    }
                  `}
                  style={
                    selectedTime === time ? { backgroundColor: themeColor } : {}
                  }
                >
                  {time}
                </button>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-6 text-gray-400 text-sm font-medium border border-dashed border-gray-200 rounded-sm bg-gray-50">
              Brak wolnych terminów w wybranym dniu.
            </div>
          )}
        </div>

        <button
          disabled={!selectedTime}
          onClick={() => {
            if (selectedDate && selectedDateObj && selectedTime) {
              onNext(selectedDate, selectedDateObj, selectedTime);
            }
          }}
          className="w-full mt-6 text-white font-bold py-3.5 rounded-sm text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: selectedTime ? themeColor : "#d1d5db",
          }}
        >
          Przejdź do danych <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
