"use client";

import { MessageSquare, Send, X } from "lucide-react";
import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { DEFAULT_SETTINGS } from "@/lib/defaultSettings";

function ChatWidgetContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");

  // Inicjalizujemy stany bezpiecznymi wartościami domyślnymi
  const [themeColor, setThemeColor] = useState(
    DEFAULT_SETTINGS.chat.themeColor,
  );
  const [successMessage, setSuccessMessage] = useState(
    DEFAULT_SETTINGS.chat.customSuccessMessage,
  );

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!clientId) return;

    // Uderzamy do API po nasze zaktualizowane dane JSON
    fetch(`/api/widget/chat?clientId=${clientId}`)
      .then((res) => res.json())
      .then((data) => {
        // Zabezpieczamy się na wypadek, gdyby API zwróciło błąd (np. brak clientId)
        if (data.error) {
          console.error("API Error:", data.error);
          return;
        }

        const chatSettings = data.settings?.chat;

        if (chatSettings) {
          // Ustawiamy kolor i informujemy widget-matkę
          if (chatSettings.themeColor) {
            setThemeColor(chatSettings.themeColor);
            window.parent.postMessage(
              { type: "janowski-theme-loaded", color: chatSettings.themeColor },
              "*",
            );
          }

          // Ustawiamy nową, customową wiadomość po wysłaniu
          if (chatSettings.customSuccessMessage) {
            setSuccessMessage(chatSettings.customSuccessMessage);
          }
        }
      })
      .catch((err) => console.error("Błąd ładowania configu:", err));
  }, [clientId]);

  const handleClose = () => {
    window.parent.postMessage("close-janowski-chat", "*");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/widget/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: clientId,
          name: formState.name,
          email: formState.email,
          message: formState.message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSuccess(true);
        setFormState({ name: "", email: "", message: "" });

        setTimeout(() => {
          handleClose();
          setTimeout(() => setIsSuccess(false), 500);
        }, 2000);
      } else {
        alert("Wystąpił błąd: " + (data.error || "Spróbuj ponownie później."));
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Błąd wysyłania wiadomości:", error);
      alert("Błąd połączenia z serwerem. Sprawdź swoje połączenie.");
      setIsSubmitting(false);
    }
  };

  return (
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
              style={{ backgroundColor: themeColor, color: themeColor }}
            >
              <Send className="w-6 h-6 text-white" />
            </div>
            {/* Wyświetlamy nasz dynamiczny tekst zamiast twardo wpisanego */}
            <h4 className="text-xl font-bold mb-2">{successMessage}</h4>
            <p className="text-gray-500 text-sm">
              Odpiszemy najszybciej jak to możliwe.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Imię
              </label>
              <input
                type="text"
                required
                placeholder="Jan Kowalski"
                value={formState.name}
                onChange={(e) =>
                  setFormState({ ...formState, name: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none transition-shadow"
                style={{ outlineColor: themeColor }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="jan@firma.pl"
                value={formState.email}
                onChange={(e) =>
                  setFormState({ ...formState, email: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none transition-shadow"
                style={{ outlineColor: themeColor }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Wiadomość
              </label>
              <textarea
                required
                rows={4}
                placeholder="W czym możemy pomóc?"
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none transition-shadow"
                style={{ outlineColor: themeColor }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 text-white font-semibold py-2.5 rounded-lg text-sm transition-opacity flex items-center justify-center gap-2 disabled:opacity-70"
              style={{
                backgroundColor: themeColor,
                boxShadow: `0 4px 14px ${themeColor}60`,
              }}
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

export default function EmbeddedChatWidget() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
          Ładowanie...
        </div>
      }
    >
      <ChatWidgetContent />
    </Suspense>
  );
}
