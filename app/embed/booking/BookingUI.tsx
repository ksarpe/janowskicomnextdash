"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  Clock,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
} from "lucide-react";
import { createAppointment } from "@/app/api/widget/booking/actions";

interface BookingUIProps {
  clientId?: string;
  themeColor: string;
  initialServices: any[];
  workingHours?: any[];
  blockedTimes?: any[];
  appointments?: any[];
}

export default function BookingUI({
  clientId,
  themeColor,
  initialServices,
  workingHours = [],
  blockedTimes = [],
  appointments = [],
}: BookingUIProps) {
  // Stan aplikacji
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Zebrane dane od klienta
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Stan kalendarza
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const year = currentMonth.getFullYear();
  const calendarMonth = currentMonth.getMonth();
  const daysInMonth = new Date(year, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, calendarMonth, 1).getDay();
  const offset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getLocalDateStr = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const isDayAvailable = (d: Date) => {
    if (d < today) return false;
    const localStr = getLocalDateStr(d);
    const dayOfWeek = d.getDay();
    const workDay = workingHours.find((w) => w.dayOfWeek === dayOfWeek);
    if (!workDay || !workDay.isActive) return false;

    const dayBlocks = blockedTimes.filter((b) => b.date === localStr);
    if (dayBlocks.some((b) => b.allDay)) return false;
    
    return true;
  };

  const getAvailableTimes = (targetDate: Date, duration: number) => {
    const localStr = getLocalDateStr(targetDate);
    const dayOfWeek = targetDate.getDay();
    const workDay = workingHours.find((w) => w.dayOfWeek === dayOfWeek);
    if (!workDay || !workDay.isActive) return [];

    let [startH, startM] = workDay.startTime.split(":").map(Number);
    const [endH, endM] = workDay.endTime.split(":").map(Number);
    let currentMins = startH * 60 + startM;
    const endMinsTotal = endH * 60 + endM;

    const dayBlocks = blockedTimes.filter((b) => b.date === localStr && !b.allDay);
    const dayAppointments = appointments.filter((a) => a.date === localStr && a.status !== "CANCELLED");

    const slots: string[] = [];
    while (currentMins + duration <= endMinsTotal) {
      const slotStart = currentMins;
      const slotEnd = currentMins + duration;

      const overlapsAppt = dayAppointments.some(app => {
         const [aStartH, aStartM] = app.startTime.split(":").map(Number);
         const [aEndH, aEndM] = app.endTime.split(":").map(Number);
         return (slotStart < aEndH * 60 + aEndM && slotEnd > aStartH * 60 + aStartM);
      });

      const overlapsBlock = dayBlocks.some(b => {
         if (!b.startTime || !b.endTime) return false;
         const [bStartH, bStartM] = b.startTime.split(":").map(Number);
         const [bEndH, bEndM] = b.endTime.split(":").map(Number);
         return (slotStart < bEndH * 60 + bEndM && slotEnd > bStartH * 60 + bStartM);
      });

      // Avoid booking in the past for today
      const isToday = targetDate.getTime() === today.getTime();
      const currentRealMins = new Date().getHours() * 60 + new Date().getMinutes();
      const isInPast = isToday && slotStart <= currentRealMins;

      if (!overlapsAppt && !overlapsBlock && !isInPast) {
         const h = Math.floor(slotStart / 60);
         const m = slotStart % 60;
         slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
      }

      currentMins += 30; // 30 mins step
    }
    return slots;
  };

  const quickDates = [];
  let dayOffset = 0;
  while (quickDates.length < 3 && dayOffset < 30) {
    const d = new Date(today);
    d.setDate(today.getDate() + dayOffset);

    if (isDayAvailable(d)) {
      let label = d.toLocaleDateString("pl-PL", { weekday: "short" });
      if (dayOffset === 0) label = "Dziś";
      else if (dayOffset === 1) label = "Jutro";
      else if (dayOffset === 2) label = "Pojutrze";

      const dateStr = d.toLocaleDateString("pl-PL", {
        day: "numeric",
        month: "short",
      });
      quickDates.push({ label, dateStr, d });
    }
    dayOffset++;
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, calendarMonth - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, calendarMonth + 1, 1));
  };

  const handleClose = () => {
    window.parent.postMessage("close-booking-widget", "*");
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDateObj || !selectedTime || !clientId) return;

    setIsSubmitting(true);
    try {
      const [startH, startM] = selectedTime.split(":").map(Number);
      const endMins = startH * 60 + startM + selectedService.duration;
      const endH = Math.floor(endMins / 60);
      const endM = endMins % 60;
      const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

      const localDateStr = getLocalDateStr(selectedDateObj);

      const res = await createAppointment({
        clientId: clientId,
        serviceId: selectedService.id,
        date: localDateStr,
        startTime: selectedTime,
        endTime: endTime,
        customerName,
        customerPhone,
      });

      if (res.success) {
        setIsSuccess(true);
        setTimeout(() => {
          handleClose();
        }, 3000);
      } else {
        alert(res.error || "Wystąpił błąd");
      }
    } catch (e) {
      console.error(e);
      alert("Wystąpił błąd serwera");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tytuły poszczególnych kroków
  const stepTitles = ["Wybierz usługę", "Wybierz termin", "Twoje dane"];

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-white p-6 text-center animate-in fade-in zoom-in duration-500">
        <CheckCircle2
          className="w-16 h-16 mb-4"
          style={{ color: themeColor }}
        />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Rezerwacja potwierdzona!
        </h3>
        <p className="text-gray-500">
          Dziękujemy. Wysłaliśmy potwierdzenie na Twój adres e-mail.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen bg-white text-gray-900 font-sans">
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="p-1.5 -ml-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <Calendar className="w-5 h-5" style={{ color: themeColor }} />
          )}
          <h3 className="font-semibold text-gray-900">Umów wizytę</h3>
        </div>
        <button
          onClick={handleClose}
          className="p-1.5 -mr-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* PASEK POSTĘPU I TREŚĆ */}
      <div className="p-5 flex-1 overflow-y-auto bg-gray-50/50">
        {/* Wskaźnik kroków */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Krok {step} z 3
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: themeColor }}
            >
              {stepTitles[step - 1]}
            </span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 ease-out"
              style={{
                width: `${(step / 3) * 100}%`,
                backgroundColor: themeColor,
              }}
            />
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* KROK 1: WYBÓR USŁUGI */}
        {/* ------------------------------------------------------------------ */}
        {step === 1 && (
          <div className="flex flex-col gap-3 animate-in slide-in-from-right-8 fade-in duration-300 pb-8">
            {initialServices.map((service) => (
              <button
                key={service.id}
                onClick={() => {
                  setSelectedService(service);
                  setStep(2);
                }}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl text-left hover:border-gray-400 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 shrink-0 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-xl group-hover:scale-110 transition-transform">
                  {service.icon}
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start w-full mb-1">
                    <span className="font-semibold text-gray-900 leading-tight">
                      {service.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center w-full mt-1">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                      <Clock className="w-3 h-3" /> {service.duration}
                    </span>
                    <span className="font-medium text-xs text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                      {service.price}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* KROK 2: WYBÓR DATY I GODZINY */}
        {/* ------------------------------------------------------------------ */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right-8 fade-in duration-300 pb-8">
            <p className="text-sm font-semibold text-gray-900 mb-3">
              Wybierz datę
            </p>

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
                      className={`shrink-0 flex flex-col items-center justify-center w-[84px] h-[84px] rounded-2xl border transition-all snap-start ${
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

                {/* Wybierz z kalendarza Button */}
                <button
                  onClick={() => setShowFullCalendar(true)}
                  className="shrink-0 flex flex-col items-center justify-center w-[84px] h-[84px] rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-all snap-start"
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
              <div className="bg-white border text-gray-900 border-gray-200 rounded-2xl p-4 shadow-sm mb-6 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
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
                    const isAvailable = isDayAvailable(dateObj);

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
                          aspect-square flex items-center justify-center rounded-xl text-sm transition-all
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
                  className="w-full mt-4 flex items-center justify-center py-2 text-[10px] font-bold text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors uppercase tracking-widest bg-gray-50 rounded-xl"
                >
                  Zwiń kalendarz
                </button>
              </div>
            )}

            {/* Dostępne Godziny (Pokazują się tylko po wybraniu dnia) */}
            <div
              className={`transition-all duration-300 overflow-hidden ${selectedDate ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0 pointer-events-none"}`}
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
                {selectedDateObj && selectedService && getAvailableTimes(selectedDateObj, selectedService.duration).length > 0 ? (
                  getAvailableTimes(selectedDateObj, selectedService.duration).map((time) => {
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`
                          py-3 rounded-xl border text-sm font-semibold transition-all
                          ${
                            selectedTime === time
                              ? "text-white shadow-md transform scale-105 border-transparent"
                              : "bg-white text-gray-700 hover:border-gray-400 border-gray-200 shadow-sm"
                          }
                        `}
                        style={selectedTime === time ? { backgroundColor: themeColor } : {}}
                      >
                        {time}
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-3 text-center py-6 text-gray-400 text-sm font-medium border border-dashed border-gray-200 rounded-xl bg-gray-50">
                    Brak wolnych terminów w wybranym dniu.
                  </div>
                )}
              </div>

              <button
                disabled={!selectedTime}
                onClick={() => setStep(3)}
                className="w-full mt-6 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: selectedTime ? themeColor : "#d1d5db",
                }}
              >
                Przejdź do danych <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* KROK 3: FORMULARZ DANYCH */}
        {/* ------------------------------------------------------------------ */}
        {step === 3 && (
          <div className="animate-in slide-in-from-right-8 fade-in duration-300">
            {/* Podsumowanie wyboru jako elegancka "paragonowa" karta */}
            <div className="mb-6 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm">
              <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">
                    Usługa
                  </p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {selectedService?.name}
                  </p>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-gray-400 hover:text-gray-900 underline"
                >
                  Zmień
                </button>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-400 font-medium mb-0.5">
                    Termin
                  </p>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: themeColor }}
                  >
                    {selectedDate}, {selectedTime}
                  </p>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-gray-400 hover:text-gray-900 underline"
                >
                  Zmień
                </button>
              </div>
            </div>

            {/* Formularz właściwy */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="np. Jan Kowalski"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition-shadow placeholder:text-gray-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Numer telefonu
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+48 ___ ___ ___"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none transition-shadow placeholder:text-gray-300"
                />
              </div>

              <p className="text-xs text-gray-400 mt-2 text-center">
                Klikając "Potwierdź", akceptujesz regulamin rezerwacji.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 text-white font-bold py-3.5 rounded-xl text-sm transition-transform active:scale-[0.98] shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: themeColor }}
              >
                {isSubmitting ? "Przetwarzanie..." : "Potwierdź rezerwację"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
