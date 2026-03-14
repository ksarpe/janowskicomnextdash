"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateWidgetConfig(
  clientId: string,
  allowedDomains: string[],
  chatSettings: {
    customSuccessMessage: string;
    themeColor: string;
    position: string;
    requirePhone: boolean;
  },
) {
  try {
    // Pobieramy obecny config, żeby złączyć stare ustawienia JSON z nowymi
    const currentConfig = await prisma.widgetConfig.findUnique({
      where: { clientId },
    });

    const currentExtraSettings = (currentConfig?.extraSettings as any) || {};

    // Aktualizujemy bazę danych
    await prisma.widgetConfig.update({
      where: { clientId },
      data: {
        allowedDomains,
        extraSettings: {
          ...currentExtraSettings,
          chat: {
            ...currentExtraSettings.chat,
            customSuccessMessage: chatSettings.customSuccessMessage,
            themeColor: chatSettings.themeColor,
            position: chatSettings.position,
            requirePhone: chatSettings.requirePhone,
          },
        },
      },
    });

    // Odświeżamy cache strony, by formularz od razu pokazał nowe dane
    revalidatePath("/settings");
    revalidatePath(`/api/widget/config/chat?clientId=${clientId}`);
    return { success: true };
  } catch (error) {
    console.error("Błąd zapisu:", error);
    return { success: false, error: "Nie udało się zapisać ustawień." };
  }
}
