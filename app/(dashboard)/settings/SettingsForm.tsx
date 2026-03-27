"use client";

import { useState } from "react";
import { updateWidgetConfig } from "./actions";
import {
  Save,
  Globe,
  Palette,
  MessageSquare,
  Calendar,
  Box,
} from "lucide-react";
import { WidgetSettings, WidgetPosition } from "@/lib/defaultSettings";

interface SettingsFormProps {
  clientId: string;
  initialDomains: string[];
  initialSettings: WidgetSettings;
}

export default function SettingsForm({
  clientId,
  initialDomains,
  initialSettings,
}: SettingsFormProps) {
  const [domains, setDomains] = useState(initialDomains.join(", "));
  const [chatMessage, setChatMessage] = useState(
    initialSettings.chat.customSuccessMessage,
  );
  const [themeColor, setThemeColor] = useState(initialSettings.chat.themeColor);
  const [position, setPosition] = useState<WidgetPosition>(
    initialSettings.chat.position,
  );
  const [requirePhone, setRequirePhone] = useState(
    initialSettings.chat.requirePhone,
  );
  const [welcomeMessage, setWelcomeMessage] = useState(
    initialSettings.chat.welcomeMessage,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "booking" | "3d">("chat");

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const domainsArray = domains
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const result = await updateWidgetConfig(clientId, domainsArray, {
      customSuccessMessage: chatMessage,
      themeColor: themeColor,
      position: position,
      requirePhone: requirePhone,
      welcomeMessage: welcomeMessage,
    });

    setIsSaving(false);
    if (result.success) {
      alert("Ustawienia zapisane pomyślnie! Odśwież widżet na swojej stronie.");
    } else {
      alert("Błąd: " + result.error);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-bg border border-border rounded-sm text-text text-sm focus:outline-none focus:ring-1 transition-all placeholder-text-subtle";

  const sectionClass = "bg-bg-alt p-6 rounded-sm border border-border";

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Sekcja: Globalne Ustawienia */}
      <div className={sectionClass}>
        <h2 className="text-lg font-semibold text-text flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-text-muted" />
          Ustawienia Globalne
        </h2>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-2">
            Dozwolone domeny (oddziel przecinkiem)
          </label>
          <p className="text-xs text-text-subtle mb-3">
            Tylko na tych stronach Twoje widżety będą działać ze względów
            bezpieczeństwa.
          </p>
          <input
            type="text"
            value={domains}
            onChange={(e) => setDomains(e.target.value)}
            className={inputClass}
            placeholder="https://kasperjanowski.com, http://localhost:3001"
          />
        </div>
      </div>

      {/* Zakładki widżetów */}
      <h2 className="text-xl font-bold text-text pt-2">Ustawienia widgetów</h2>

      <div className="bg-bg-alt rounded-sm border border-border overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-border">
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className="flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors"
            style={{
              borderColor:
                activeTab === "chat" ? "var(--primary)" : "transparent",
              color:
                activeTab === "chat" ? "var(--primary)" : "var(--text-muted)",
              backgroundColor:
                activeTab === "chat" ? "var(--primary)0a" : "transparent",
            }}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
          <button
            type="button"
            disabled
            className="flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 border-transparent text-text-subtle opacity-50 cursor-not-allowed"
          >
            <Calendar className="w-4 h-4" />
            Booking System (Wkrótce)
          </button>
          <button
            type="button"
            disabled
            className="flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 border-transparent text-text-subtle opacity-50 cursor-not-allowed"
          >
            <Box className="w-4 h-4" />
            3D Visualization (Wkrótce)
          </button>
        </div>

        <div className="p-6">
          {activeTab === "chat" && (
            <div className="space-y-8">
              {/* Wygląd */}
              <div>
                <h3 className="text-base font-semibold text-text flex items-center gap-2 mb-6">
                  <Palette className="w-5 h-5 text-text-muted" />
                  Wygląd widżetu
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Główny kolor (Theme Color)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="w-11 h-11 rounded-sm cursor-pointer border-0 p-0.5 bg-bg-surface"
                      />
                      <input
                        type="text"
                        value={themeColor}
                        onChange={(e) => setThemeColor(e.target.value)}
                        className="px-3 py-2 border border-border bg-bg rounded-sm text-sm font-mono w-32 text-text focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-2">
                      Pozycja widżetu
                    </label>
                    <select
                      value={position}
                      onChange={(e) =>
                        setPosition(e.target.value as WidgetPosition)
                      }
                      className="px-3 py-2 border border-border bg-bg rounded-sm text-sm w-48 text-text focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                    >
                      <option value="bottom-right">Prawy dół (Standard)</option>
                      <option value="bottom-left">Lewy dół</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="requirePhone"
                      checked={requirePhone}
                      onChange={(e) => setRequirePhone(e.target.checked)}
                      className="w-4 h-4 rounded accent-primary"
                    />
                    <label
                      htmlFor="requirePhone"
                      className="text-sm font-medium text-text-muted"
                    >
                      Wymagaj numeru telefonu
                    </label>
                  </div>
                </div>
              </div>

              <hr className="border-border" />

              {/* Wiadomości */}
              <div>
                <h3 className="text-base font-semibold text-text flex items-center gap-2 mb-6">
                  <MessageSquare className="w-5 h-5 text-text-muted" />
                  Ustawienia wiadomości
                </h3>

                <div className="space-y-5">
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    Wiadomość powitalna
                  </label>
                  <input
                    type="text"
                    value={welcomeMessage}
                    onChange={(e) => setWelcomeMessage(e.target.value)}
                    className={inputClass}
                    placeholder="np. Cześć! Jak mogę Ci pomóc?"
                  />
                  <label className="block text-sm font-medium text-text-muted mb-2">
                    Wiadomość po pomyślnym wysłaniu zapytania
                  </label>
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className={inputClass}
                    placeholder="np. Dziękujemy! Odezwiemy się wkrótce."
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-sm transition-all disabled:opacity-50 shadow-lg"
        style={{
          backgroundColor: "var(--primary)",
          boxShadow: "0 4px 14px var(--primary)40",
        }}
      >
        <Save className="w-5 h-5" />
        {isSaving ? "Zapisywanie..." : "Zapisz ustawienia"}
      </button>
    </form>
  );
}
