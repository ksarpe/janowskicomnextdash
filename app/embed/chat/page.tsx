"use client";

import { MessageSquare, Send, X } from "lucide-react";
import React, { useState, useEffect } from "react";
// Aby pobrać parametry z paska URL iframe'a
import { useSearchParams } from 'next/navigation'; 
import { motion } from "framer-motion";

export default function EmbeddedChatWidget() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('clientId');
  // Pobranie koloru początkowego z URL lub domyślny CYAN
  const initialColor = searchParams.get('color') || "#00bcd4";

  const [themeColor, setThemeColor] = useState(initialColor);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Nasłuchiwanie na komunikaty ze strony nadrzędnej (zmiana koloru przez Demo na portfolio)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'update-theme' && event.data?.color) {
        setThemeColor(event.data.color);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleClose = () => {
    // Wysłanie komunikatu do strony nadrzędnej, by skrypt ukrył Iframe
    window.parent.postMessage('close-janowski-chat', '*');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Symulacja wysyłki do API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        handleClose();
        setTimeout(() => setIsSuccess(false), 500);
      }, 2000);
    }, 1500);
  };

  return (
    // Używamy min-h-screen i bg-transparent, sam kontener formularza nadaje tło.
    // Dzięki temu krawędzie iframe są niewidoczne, widać tylko panel.
    <div className="flex flex-col w-full h-full bg-white text-gray-900 font-sans">
      
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageSquare className="w-5 h-5" style={{ color: themeColor }} />
          Napisz do nas
        </h3>
        <button 
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 overflow-y-auto">
        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="py-10 text-center flex flex-col items-center justify-center"
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4 bg-opacity-20"
              style={{ backgroundColor: themeColor, color: themeColor }} // Opcjonalnie: użyj funkcji dla jaśniejszego tła
            >
              <Send className="w-6 h-6 text-white" />
            </div>
            <h4 className="text-xl font-bold mb-2">Wiadomość wysłana!</h4>
            <p className="text-gray-500 text-sm">Odpiszemy najszybciej jak to możliwe.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Imię</label>
              <input
                type="text" required placeholder="Jan Kowalski"
                value={formState.name}
                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none transition-shadow"
                style={{ outlineColor: themeColor }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
              <input
                type="email" required placeholder="jan@firma.pl"
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none transition-shadow"
                style={{ outlineColor: themeColor }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Wiadomość</label>
              <textarea
                required rows={4} placeholder="W czym możemy pomóc?"
                value={formState.message}
                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none transition-shadow"
                style={{ outlineColor: themeColor }}
              />
            </div>

            <button
              type="submit" disabled={isSubmitting}
              className="w-full mt-2 text-white font-semibold py-2.5 rounded-lg text-sm transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ backgroundColor: themeColor, boxShadow: `0 4px 14px ${themeColor}60` }}
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Wyślij <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}