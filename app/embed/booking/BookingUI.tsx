"use client";

import React, { useState } from "react";
import { X, Calendar, ArrowLeft, CheckCircle2 } from "lucide-react";
import { createAppointment } from "@/app/api/widget/booking/actions";
import { Step1Service } from "./components/Step1Service";
import { Step2Date } from "./components/Step2Date";
import { Step3Form } from "./components/Step3Form";
import { getLocalDateStr } from "./bookingUtils";

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
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateObj, setSelectedDateObj] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleClose = () => {
    window.parent.postMessage("close-booking-widget", "*");
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (customerName: string, customerPhone: string) => {
    if (!selectedService || !selectedDateObj || !selectedTime || !clientId)
      return;

    setIsSubmitting(true);
    try {
      const [startH, startM] = selectedTime.split(":").map(Number);
      const endMins = startH * 60 + startM + selectedService.duration;
      const endH = Math.floor(endMins / 60);
      const endM = endMins % 60;
      const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

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
      <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="p-1.5 -ml-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-sm transition-colors"
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
          className="p-1.5 -mr-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-5 flex-1 overflow-y-auto bg-gray-50/50">
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

        {step === 1 && (
          <Step1Service
            initialServices={initialServices}
            themeColor={themeColor}
            onSelect={(service) => {
              setSelectedService(service);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <Step2Date
            themeColor={themeColor}
            selectedService={selectedService}
            workingHours={workingHours}
            blockedTimes={blockedTimes}
            appointments={appointments}
            onNext={(dateStr, dateObj, time) => {
              setSelectedDate(dateStr);
              setSelectedDateObj(dateObj);
              setSelectedTime(time);
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <Step3Form
            themeColor={themeColor}
            selectedService={selectedService}
            selectedDate={selectedDate!}
            selectedTime={selectedTime!}
            isSubmitting={isSubmitting}
            onBackToService={() => setStep(1)}
            onBackToDate={() => setStep(2)}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
