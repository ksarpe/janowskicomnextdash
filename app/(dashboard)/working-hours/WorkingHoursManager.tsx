"use client";

import React, { useState } from "react";
import { Clock, CalendarOff, Save, Trash, Plus, Check } from "lucide-react";
import { updateWorkingHours, addBlockedTime, deleteBlockedTime } from "@/app/api/widget/booking/actions";

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
  initialExceptions 
}: { 
  initialHours: any[];
  initialExceptions: { id: string; date: string; allDay: boolean; startTime: string | null; endTime: string | null; label: string; }[];
}) {
  const [activeTab, setActiveTab] = useState<"schedule" | "exceptions">("schedule");
  const [hours, setHours] = useState(
    DAYS_OF_WEEK.map((day) => {
      const found = initialHours.find((h) => h.dayOfWeek === day.value);
      return {
        dayOfWeek: day.value,
        label: day.label,
        startTime: found?.startTime || "08:00",
        endTime: found?.endTime || "16:00",
        isActive: found ? found.isActive : (day.value > 0 && day.value < 6),
      };
    })
  );
  
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmittingException, setIsSubmittingException] = useState(false);

  const [exceptions, setExceptions] = useState(initialExceptions);
  const [exceptionForm, setExceptionForm] = useState({ date: "", allDay: true, startTime: "12:00", endTime: "14:00" });

  const handleDayChange = (dayOfWeek: number, field: string, value: any) => {
    setHours(prev => prev.map(h => (h.dayOfWeek === dayOfWeek ? { ...h, [field]: value } : h)));
  };

  const handleSaveSchedule = async () => {
    setIsSaving(true);
    try {
      await updateWorkingHours(
        hours.map(({ dayOfWeek, startTime, endTime, isActive }) => ({ dayOfWeek, startTime, endTime, isActive }))
      );
      alert("Grafik został zapisany!");
    } catch (e) {
      console.error(e);
      alert("Wystąpił błąd podczas zapisywania.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddException = async (e: React.FormEvent) => {
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
        const dateStr = dateObj.toLocaleDateString("pl-PL", { day: 'numeric', month: 'long' });
        const label = exceptionForm.allDay 
          ? `${dateStr} - Cały dzień` 
          : `${dateStr} - Od ${exceptionForm.startTime} do ${exceptionForm.endTime}`;
          
        setExceptions([...exceptions, { 
          id: res.exception.id, 
          date: exceptionForm.date, 
          allDay: exceptionForm.allDay, 
          startTime: exceptionForm.startTime || null, 
          endTime: exceptionForm.endTime || null, 
          label 
        }].sort((a,b) => a.date.localeCompare(b.date)));
        
        setExceptionForm({ date: "", allDay: true, startTime: "12:00", endTime: "14:00" });
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
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-black text-text">Godziny pracy</h1>
          <p className="text-sm text-text-muted mt-1 max-w-2xl">
            Skonfiguruj standardowe godziny działania warsztatu i zarządzaj blokadami kalendarza w dni wolne lub urlopy.
          </p>
        </div>

        <div className="flex items-center gap-2 mb-6 border-b border-dash-border pb-2 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab("schedule")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === "schedule"
                ? "bg-primary text-white"
                : "text-text-muted hover:bg-dash-card hover:text-text"
            }`}
          >
            <Clock className="w-4 h-4" />
            Stały grafik
          </button>
          <button
            onClick={() => setActiveTab("exceptions")}
            className={`px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-colors flex items-center gap-2 shrink-0 ${
              activeTab === "exceptions"
                ? "bg-primary text-white"
                : "text-text-muted hover:bg-dash-card hover:text-text"
            }`}
          >
            <CalendarOff className="w-4 h-4" />
            Wyjątki i urlopy
          </button>
        </div>

        {activeTab === "schedule" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
            <div className="p-1 rounded-2xl border border-dash-border bg-dash-card shadow-sm overflow-hidden">
              <div className="divide-y divide-dash-border flex flex-col">
                {hours.map((day) => (
                  <div key={day.dayOfWeek} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:bg-dash-bg focus-within:bg-dash-bg group">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={day.isActive}
                          onChange={(e) => handleDayChange(day.dayOfWeek, "isActive", e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-black/5" />
                      </label>
                      <span className={`font-bold sm:w-32 text-base ${day.isActive ? "text-text" : "text-text-muted opacity-60"}`}>
                        {day.label}
                      </span>
                    </div>

                    <div className={`flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto transition-all duration-300 mt-2 sm:mt-0 ${day.isActive ? "opacity-100" : "opacity-0 pointer-events-none scale-95 sm:scale-100 origin-left"}`}>
                      <input
                        type="time"
                        value={day.startTime}
                        onChange={(e) => handleDayChange(day.dayOfWeek, "startTime", e.target.value)}
                        className="flex-1 sm:flex-none w-full sm:w-[130px] border border-dash-border bg-dash-bg text-text rounded-xl px-4 py-3 sm:py-2.5 text-base sm:text-sm font-semibold text-center focus:outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
                        disabled={!day.isActive}
                      />
                      <span className="text-text-muted font-bold px-1 sm:px-2">-</span>
                      <input
                        type="time"
                        value={day.endTime}
                        onChange={(e) => handleDayChange(day.dayOfWeek, "endTime", e.target.value)}
                        className="flex-1 sm:flex-none w-full sm:w-[130px] border border-dash-border bg-dash-bg text-text rounded-xl px-4 py-3 sm:py-2.5 text-base sm:text-sm font-semibold text-center focus:outline-none focus:border-primary transition-colors focus:ring-2 focus:ring-primary/20"
                        disabled={!day.isActive}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end pt-2 border-t border-dash-border">
              <button
                onClick={handleSaveSchedule}
                disabled={isSaving}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 sm:py-3 bg-primary text-white font-bold rounded-xl text-base sm:text-sm transition-transform active:scale-95 disabled:opacity-50 shadow-sm"
              >
                <Save className="w-5 h-5 sm:w-4 sm:h-4" />
                {isSaving ? "Zapisywanie..." : "Zapisz grafik"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "exceptions" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 space-y-8">
            <div className="bg-primary/10 p-5 rounded-2xl border border-primary/20 text-sm font-medium leading-relaxed" style={{ color: "var(--primary-dark)" }}>
              <div className="flex items-start gap-3">
                 <CalendarOff className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "var(--primary)" }} />
                 <p>Zablokuj dni, w których warsztat jest zamknięty (np. święta, urlop) lub konkretne godziny, aby wyłączyć możliwość rezerwacji w widżecie.</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-text mb-2 px-1">Dodane wyjątki</h3>
              {exceptions.length === 0 && (
                 <div className="p-10 flex flex-col items-center justify-center gap-3 text-text-muted border border-dashed border-dash-border rounded-3xl bg-dash-card/30">
                    <CalendarOff className="w-8 h-8 opacity-20" />
                    <p className="text-sm font-medium">Brak dodanych wyjątków.</p>
                 </div>
              )}
              {exceptions.map((ex) => (
                <div key={ex.id} className="flex items-center justify-between p-4 sm:p-5 bg-dash-card border border-dash-border rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] transition-all">
                  <span className="font-bold text-text text-[15px] flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <CalendarOff className="w-4 h-4 text-primary" />
                    </div>
                    {ex.label}
                  </span>
                  <button 
                    onClick={() => handleDeleteException(ex.id)}
                    className="p-2.5 sm:p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-xl sm:rounded-lg transition-colors"
                    title="Usuń"
                  >
                    <Trash className="w-5 h-5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddException} className="p-5 sm:p-7 border border-dash-border bg-dash-card rounded-3xl shadow-sm flex flex-col gap-6 mt-4">
              <div className="pb-4 border-b border-dash-border">
                <h3 className="text-base font-bold text-text flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" />
                  Dodaj nowy wyjątek
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">Data zablokowania *</label>
                    <input
                      type="date"
                      required
                      value={exceptionForm.date}
                      onChange={(e) => setExceptionForm({ ...exceptionForm, date: e.target.value })}
                      className="w-full bg-dash-bg border border-dash-border rounded-xl px-4 py-3.5 text-base sm:text-sm font-medium focus:outline-none focus:border-primary text-text transition-colors focus:ring-2 focus:ring-primary/20"
                    />
                 </div>
                 
                 <div className="flex flex-col md:justify-center pt-2 md:pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group w-fit p-2 -ml-2 rounded-xl hover:bg-dash-bg transition-colors">
                      <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
                         <input 
                           type="checkbox" 
                           checked={exceptionForm.allDay}
                           onChange={(e) => setExceptionForm({ ...exceptionForm, allDay: e.target.checked })}
                           className="peer sr-only" 
                         />
                         <div className="w-6 h-6 border-[2.5px] border-dash-border rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all bg-dash-bg" />
                         <Check className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" strokeWidth={3} />
                      </div>
                      <span className="text-[15px] font-bold text-text group-hover:text-primary transition-colors">Cały dzień zablokowany</span>
                    </label>
                 </div>
              </div>

              <div className={`grid grid-cols-2 gap-4 transition-all duration-300 ease-in-out overflow-hidden bg-dash-bg/50 rounded-2xl ${
                exceptionForm.allDay ? 'max-h-0 opacity-0 pointer-events-none mt-0' : 'max-h-32 opacity-100 p-4 border border-dash-border mt-2'
              }`}>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">Godzina od</label>
                    <input
                      type="time"
                      value={exceptionForm.startTime}
                      onChange={(e) => setExceptionForm({ ...exceptionForm, startTime: e.target.value })}
                      className="w-full bg-dash-bg border border-dash-border rounded-xl px-3 py-3 text-base sm:text-sm font-bold text-center focus:outline-none focus:border-primary text-text transition-colors focus:ring-2 focus:ring-primary/20 shadow-sm"
                      disabled={exceptionForm.allDay}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">Godzina do</label>
                    <input
                      type="time"
                      value={exceptionForm.endTime}
                      onChange={(e) => setExceptionForm({ ...exceptionForm, endTime: e.target.value })}
                      className="w-full bg-dash-bg border border-dash-border rounded-xl px-3 py-3 text-base sm:text-sm font-bold text-center focus:outline-none focus:border-primary text-text transition-colors focus:ring-2 focus:ring-primary/20 shadow-sm"
                      disabled={exceptionForm.allDay}
                    />
                  </div>
              </div>

              <div className="flex justify-end pt-3 sm:pt-4">
                 <button 
                  type="submit"
                  className="flex items-center justify-center w-full sm:w-auto gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl text-base sm:text-sm transition-transform active:scale-95 shadow-md shadow-primary/20"
                 >
                   <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
                   Dodaj blokadę
                 </button>
              </div>
            </form>

          </div>
        )}
      </div>
    </div>
  );
}
