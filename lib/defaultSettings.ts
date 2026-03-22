// src/lib/defaultSettings.ts

export type WidgetPosition = "bottom-right" | "bottom-left";

export interface ChatWidgetConfig {
  customSuccessMessage: string;
  welcomeMessage: string;
  themeColor: string;
  position: WidgetPosition;
  requirePhone: boolean;
}

export interface WidgetSettings {
  chat: ChatWidgetConfig;
}

export const DEFAULT_SETTINGS: WidgetSettings = {
  chat: {
    customSuccessMessage:
      "Wiadomość wysłana! Odpowiemy najszybciej jak to możliwe.",
    welcomeMessage: "Cześć! Jak mogę Ci pomóc?",
    themeColor: "#00bcd4",
    position: "bottom-right",
    requirePhone: false,
  },
};
