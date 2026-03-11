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
import { WidgetSettings } from "@/lib/defaultSettings";

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
  const [position, setPosition] = useState(initialSettings.chat.position);
  const [requirePhone, setRequirePhone] = useState(
    initialSettings.chat.requirePhone,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "booking" | "3d">("chat");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Przerabiamy string z domenami na czystą tablicę
    const domainsArray = domains
      .split(",")
      .map((d) => d.trim())
      .filter((d) => d.length > 0);

    const result = await updateWidgetConfig(clientId, domainsArray, {
      customSuccessMessage: chatMessage,
      themeColor: themeColor,
      position: position,
      requirePhone: requirePhone,
    });

    setIsSaving(false);
    if (result.success) {
      alert("Ustawienia zapisane pomyślnie! Odśwież widżet na swojej stronie.");
    } else {
      alert("Błąd: " + result.error);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8">
      {/* Sekcja: Globalne Ustawienia */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-indigo-500" />
          Ustawienia Globalne
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dozwolone domeny (oddziel przecinkiem)
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Tylko na tych stronach Twoje widżety będą działać ze względów
            bezpieczeństwa (Whitelisting). Wpisz z http/https.
          </p>
          <input
            type="text"
            value={domains}
            onChange={(e) => setDomains(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="https://kasperjanowski.com, http://localhost:3001"
          />
        </div>
      </div>

      {/* Sekcja: Ustawienia Widżetów w zakładkach */}
      <h2 className="text-xl font-bold text-gray-900 pt-4">
        Ustawienia widgetów
      </h2>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === "chat"
                ? "border-cyan-500 text-cyan-600 bg-cyan-50/30"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </button>
          <button
            type="button"
            disabled
            className="flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors border-transparent text-gray-400 bg-gray-50 opacity-60 cursor-not-allowed"
          >
            <Calendar className="w-4 h-4" />
            Booking System (Wkrótce)
          </button>
          <button
            type="button"
            disabled
            className="flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors border-transparent text-gray-400 bg-gray-50 opacity-60 cursor-not-allowed"
          >
            <Box className="w-4 h-4" />
            3D Visualization (Wkrótce)
          </button>
        </div>

        <div className="p-6">
          {activeTab === "chat" && (
            <div className="space-y-8">
              {/* Wygląd Czatu */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                  <Palette className="w-5 h-5 text-cyan-500" />
                  Wygląd widżetu
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Główny kolor (Theme Color)
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono w-32 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <input
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono w-32 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="requirePhone"
                        checked={requirePhone}
                        onChange={(e) => setRequirePhone(e.target.checked)}
                        className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                      />
                      <label
                        htmlFor="requirePhone"
                        className="text-sm font-medium text-gray-700"
                      >
                        Wymagaj numeru telefonu
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Personalizacja Czatu */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                  <MessageSquare className="w-5 h-5 text-cyan-500" />
                  Ustawienia wiadomości
                </h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Wiadomość po pomyślnym wysłaniu zapytania
                  </label>
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
        className="flex items-center gap-2 px-6 py-3 bg-cyan-600 text-white font-medium rounded-xl hover:bg-cyan-700 transition-colors shadow-md disabled:opacity-50"
      >
        <Save className="w-5 h-5" />
        {isSaving ? "Zapisywanie..." : "Zapisz ustawienia"}
      </button>
    </form>
  );
}
