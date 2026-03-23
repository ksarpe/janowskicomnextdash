import React, { useState } from "react";

interface Step3FormProps {
  themeColor: string;
  selectedService: any;
  selectedDate: string;
  selectedTime: string;
  isSubmitting: boolean;
  onBackToService: () => void;
  onBackToDate: () => void;
  onSubmit: (name: string, phone: string) => void;
}

export function Step3Form({
  themeColor,
  selectedService,
  selectedDate,
  selectedTime,
  isSubmitting,
  onBackToService,
  onBackToDate,
  onSubmit,
}: Step3FormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(customerName, customerPhone);
  };

  return (
    <div className="animate-in slide-in-from-right-8 fade-in duration-300">
      <div className="mb-6 p-4 rounded-sm bg-white border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Usługa</p>
            <p className="font-semibold text-gray-900 text-sm">
              {selectedService?.name}
            </p>
          </div>
          <button
            onClick={onBackToService}
            className="text-xs text-gray-400 hover:text-gray-900 underline"
          >
            Zmień
          </button>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">Termin</p>
            <p className="font-semibold text-sm" style={{ color: themeColor }}>
              {selectedDate}, {selectedTime}
            </p>
          </div>
          <button
            onClick={onBackToDate}
            className="text-xs text-gray-400 hover:text-gray-900 underline"
          >
            Zmień
          </button>
        </div>
      </div>

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
            className="w-full bg-white border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none transition-shadow placeholder:text-gray-300"
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
            className="w-full bg-white border border-gray-200 rounded-sm px-4 py-3 text-sm focus:outline-none transition-shadow placeholder:text-gray-300"
          />
        </div>

        <p className="text-xs text-gray-400 mt-2 text-center">
          Klikając "Potwierdź", akceptujesz regulamin rezerwacji.
        </p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 text-white font-bold py-3.5 rounded-sm text-sm transition-transform active:scale-[0.98] shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ backgroundColor: themeColor }}
        >
          {isSubmitting ? "Przetwarzanie..." : "Potwierdź rezerwację"}
        </button>
      </form>
    </div>
  );
}
