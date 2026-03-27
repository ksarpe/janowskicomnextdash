"use client";

import { MessageSquare, Send } from "lucide-react";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChatWidgetConfig } from "@/lib/defaultSettings";

// Definiujemy typy dla propsów, które dostaniemy z serwera
interface ChatFormProps {
  clientId?: string;
  initialConfig: ChatWidgetConfig;
}

// Floating label input component
function FloatingInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  themeColor,
  required,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  themeColor: string;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full border bg-chat-surface border-chat-border rounded-sm px-3 pt-5 pb-2 text-sm focus:outline-none transition-all peer"
        style={{
          outlineColor: themeColor,
          boxShadow: focused ? `0 0 0 2px ${themeColor}40` : undefined,
          borderColor: focused ? themeColor : undefined,
        }}
      />
      <label
        htmlFor={id}
        className="absolute left-3 transition-all duration-200 pointer-events-none select-none"
        style={{
          top: isFloating ? "6px" : "50%",
          transform: isFloating
            ? "translateY(0) scale(0.78)"
            : "translateY(-50%) scale(1)",
          transformOrigin: "left center",
          color: isFloating && focused ? themeColor : "#6b7280",
          fontSize: "0.875rem",
        }}
      >
        {label}
      </label>
    </div>
  );
}

// Floating label textarea component
function FloatingTextarea({
  id,
  label,
  value,
  onChange,
  themeColor,
  rows = 4,
  required,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  themeColor: string;
  rows?: number;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div className="relative">
      <textarea
        id={id}
        required={required}
        rows={rows}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full bg-chat-surface border border-chat-border rounded-sm px-3 pt-6 pb-2 text-sm resize-none focus:outline-none transition-all peer"
        style={{
          outlineColor: themeColor,
          boxShadow: focused ? `0 0 0 2px ${themeColor}40` : undefined,
          borderColor: focused ? themeColor : undefined,
        }}
      />
      <label
        htmlFor={id}
        className="absolute left-3 transition-all duration-200 pointer-events-none select-none"
        style={{
          top: isFloating ? "7px" : "14px",
          transform: isFloating ? "scale(0.78)" : "scale(1)",
          transformOrigin: "left center",
          color: isFloating && focused ? themeColor : "#6b7280",
          fontSize: "0.875rem",
        }}
      >
        {label}
      </label>
    </div>
  );
}

export default function ChatForm({ clientId, initialConfig }: ChatFormProps) {
  const [themeColor, setThemeColor] = useState(initialConfig.themeColor);
  const [successMessage, setSuccessMessage] = useState(
    initialConfig.customSuccessMessage,
  );
  const [welcomeMessage, setWelcomeMessage] = useState(
    initialConfig.welcomeMessage,
  );

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Przycisk disabled dopóki email i wiadomość nie są wypełnione
  const isFormValid =
    formState.email.trim().length > 0 && formState.message.trim().length > 0;

  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "update-theme" && event.data?.color) {
        setThemeColor(event.data.color);
      } else if (
        event.data?.type === "update-success-message" &&
        event.data?.message
      ) {
        setSuccessMessage(event.data.message);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleClose = () => {
    window.parent.postMessage("close-chat-bubble-widget", "*");
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);

    // Tryb demo dla konfiguratora - tylko symulacja
    if (clientId === "widget-configurator") {
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        setFormState({ name: "", email: "", message: "" });

        // Po krótkim czasie przywracamy formularz, żeby można było testować dalej
        setTimeout(() => {
          setIsSuccess(false);
        }, 4000);
      }, 600);
      return;
    }

    try {
      const response = await fetch("/api/widget/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        alert("Wystąpił błąd: " + (data.error || "Spróbuj ponownie."));
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Błąd wysyłania wiadomości:", error);
      alert("Błąd połączenia z serwerem.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen bg-chat-bg text-chat-text font-sans">
      {/* Header */}
      <div className="p-5 border-b border-chat-border flex justify-between items-center">
        <h3 className="font-semibold flex items-center gap-2 text-chat-text">
          <MessageSquare className="w-5 h-5" style={{ color: themeColor }} />
          {welcomeMessage}
        </h3>
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
            <h4 className="text-xl font-bold mb-2">{successMessage}</h4>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FloatingInput
              id="chat-name"
              label="Imię"
              value={formState.name}
              onChange={(e) =>
                setFormState({ ...formState, name: e.target.value })
              }
              themeColor={themeColor}
            />
            <FloatingInput
              id="chat-email"
              label="Email *"
              type="email"
              required
              value={formState.email}
              onChange={(e) =>
                setFormState({ ...formState, email: e.target.value })
              }
              themeColor={themeColor}
            />
            <FloatingTextarea
              id="chat-message"
              label="Wiadomość *"
              required
              value={formState.message}
              onChange={(e) =>
                setFormState({ ...formState, message: e.target.value })
              }
              themeColor={themeColor}
            />

            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="w-full mt-2 text-white font-semibold py-2.5 rounded-sm text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                boxShadow: isFormValid
                  ? `0 4px 14px ${themeColor}60`
                  : undefined,
                opacity:
                  isSubmitting || !isFormValid ? 0.45 : isHovered ? 0.7 : 1,
                cursor: !isFormValid ? "not-allowed" : "pointer",
                backgroundColor: !isFormValid
                  ? "var(--chat-text-muted)"
                  : themeColor,
              }}
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span className="text-chat-surface">Wyślij</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
