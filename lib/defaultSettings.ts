// src/lib/defaultSettings.ts

export interface WidgetSettings {
  chat: {
    customSuccessMessage: string;
    themeColor: string;
    position: string;
    requirePhone: boolean;
  };
}

export const DEFAULT_SETTINGS: WidgetSettings = {
  chat: {
    customSuccessMessage:
      "Wiadomość wysłana! Odpowiemy najszybciej jak to możliwe.",
    themeColor: "#00bcd4",
    position: "bottom-right",
    requirePhone: false,
  },
};
