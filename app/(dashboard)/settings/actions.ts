"use server";

import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { TAGS } from "@/lib/queries";
import { ChatWidgetConfig } from "@/lib/defaultSettings";

export async function updateWidgetConfig(
  clientId: string,
  allowedDomains: string[],
  chatSettings: ChatWidgetConfig,
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
            welcomeMessage: chatSettings.welcomeMessage,
          },
        },
      },
    });

    // Invalidate Next.js data cache so subsequent navigations get fresh data
    // @ts-expect-error Next.js Canary typings mismatch
    revalidateTag(TAGS.widgetConfig(clientId));
    revalidatePath("/settings");
    revalidatePath(`/api/widget/config/chat?clientId=${clientId}`);
    return { success: true };
  } catch (error) {
    console.error("Błąd zapisu:", error);
    return { success: false, error: "Nie udało się zapisać ustawień." };
  }
}
