import { Suspense } from "react";
import { DEFAULT_SETTINGS } from "@/lib/defaultSettings";
import ChatForm from "./ChatForm"; 

export default async function EmbeddedChatWidget({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; config?: string }>;
}) {
  const { clientId, config } = await searchParams;

  // Domyślna konfiguracja
  let configPayload = {
    themeColor: DEFAULT_SETTINGS.chat.themeColor,
    customSuccessMessage: DEFAULT_SETTINGS.chat.customSuccessMessage,
    position: DEFAULT_SETTINGS.chat.position,
    requirePhone: DEFAULT_SETTINGS.chat.requirePhone,
  };

  // ROZPAKOWUJEMY DANE Z URL (Zero bazy danych!)
  if (config) {
    try {
      // Odwracamy proces z chat-widget.js: Base64 -> URI -> JSON
      const decodedString = decodeURIComponent(atob(config));
      const parsedConfig = JSON.parse(decodedString);

      // Nadpisujemy domyślne ustawienia tymi z URL
      configPayload = {
        themeColor: parsedConfig.themeColor || configPayload.themeColor,
        customSuccessMessage: parsedConfig.customSuccessMessage || configPayload.customSuccessMessage,
        position: parsedConfig.position || configPayload.position,
        requirePhone: parsedConfig.requirePhone !== undefined ? parsedConfig.requirePhone : configPayload.requirePhone,
      };
    } catch (error) {
      console.error("Błąd dekodowania paczki z URL, ładuję domyślne:", error);
    }
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
          Ładowanie...
        </div>
      }
    >
      <ChatForm clientId={clientId} initialConfig={configPayload} />
    </Suspense>
  );
}