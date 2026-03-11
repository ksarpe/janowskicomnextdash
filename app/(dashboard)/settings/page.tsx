// src/app/(dashboard)/ustawienia/page.tsx
import { prisma } from "@/lib/db";
import { DEFAULT_SETTINGS, WidgetSettings } from "@/lib/defaultSettings";
import SettingsForm from "./SettingsForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  // get current active session from the server
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }
  const clientId = session.user.id;

  const config = await prisma.widgetConfig.findUnique({
    where: { clientId: clientId },
  });

  if (!config) {
    return (
      <div className="p-8 text-red-500">
        Nie znaleziono konfiguracji dla tego klienta. Skonfiguruj bazę.
      </div>
    );
  }

  // Magia, o której mówiliśmy: Bezpieczne łączenie danych z bazy z naszym kontraktem DEFAULT_SETTINGS
  const dbSettings = (config.extraSettings as any) || {};

  const mergedSettings: WidgetSettings = {
    ...DEFAULT_SETTINGS,
    ...dbSettings,
    chat: {
      ...DEFAULT_SETTINGS.chat,
      ...(dbSettings.chat || {}),
    },
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ustawienia Widżetu</h1>
        <p className="text-gray-500 mt-2">
          Dostosuj wygląd i zachowanie swojego systemu.
        </p>
      </div>

      {/* Renderujemy nasz interaktywny formularz kliencki i przekazujemy mu dane */}
      <SettingsForm
        clientId={clientId}
        initialDomains={config.allowedDomains}
        initialSettings={mergedSettings}
      />
    </div>
  );
}
