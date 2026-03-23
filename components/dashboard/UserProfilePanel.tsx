"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Crown,
  Check,
  ChevronRight,
  Shield,
  Star,
  Moon,
  Sun,
  User,
  CreditCard,
  Lock,
} from "lucide-react";

const PLAN_CONFIG = {
  FREE: {
    label: "Free",
    icon: Shield,
    color: "#64748b",
    bg: "#64748b14",
    features: ["1 widget", "100 wiad./mies.", "Podstawowe ustawienia"],
  },
  GROW: {
    label: "Grow",
    icon: Star,
    color: "#f59e0b",
    bg: "#f59e0b14",
    features: ["3 widgety", "1 000 wiad./mies.", "Priorytetowe wsparcie"],
  },
  ULTRA: {
    label: "Ultra",
    icon: Crown,
    color: "#dd9946",
    bg: "#dd994614",
    features: [
      "Nieograniczone widgety",
      "Nielimitowane wiadomości",
      "Analityka premium",
    ],
  },
};

interface Props {
  userName: string;
  userEmail: string;
  plan: string;
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  modalTab: "account" | "plan" | "security";
  setModalTab: (tab: "account" | "plan" | "security") => void;
}

export default function UserProfilePanel({
  userName,
  userEmail,
  plan,
  modalOpen,
  setModalOpen,
  modalTab,
  setModalTab,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const planKey =
    (plan as keyof typeof PLAN_CONFIG) in PLAN_CONFIG
      ? (plan as keyof typeof PLAN_CONFIG)
      : "FREE";
  const planCfg = PLAN_CONFIG[planKey];
  const PlanIcon = planCfg.icon;

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (modalOpen) {
          setModalOpen(false);
        }
      }
    }
    if (modalOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [modalOpen, setModalOpen]);

  return (
    <>
      {/* ── Central Modal Overlay ─────────────────────────────────────────────── */}
      {mounted &&
        createPortal(
          <div
            className={`fixed inset-0 z-100 flex items-center justify-center transition-all duration-300 ${
              modalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setModalOpen(false)}
            />

            <div
              className="relative w-full max-w-2xl mx-4 min-h-[400px] flex flex-col md:flex-row overflow-hidden shadow-2xl transition-transform duration-300"
              style={{
                backgroundColor: "var(--dash-card)",
                borderColor: "var(--dash-border)",
                transform: modalOpen ? "scale(1)" : "scale(0.95)",
                borderRadius: "24px",
              }}
            >
              {/* Modal Sidebar */}
              <div className="w-full md:w-56 p-5 border-b md:border-b-0 md:border-r border-dash-border bg-bg-alt shrink-0">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#71717a]">
                    Ustawienia
                  </h3>
                </div>

                <div className="flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar">
                  <button
                    onClick={() => setModalTab("account")}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-semibold transition-all whitespace-nowrap ${
                      modalTab === "account"
                        ? "bg-[var(--primary)18] text-primary"
                        : "text-text-muted hover:bg-bg hover:text-text"
                    }`}
                  >
                    <User className="w-4 h-4" /> Info o koncie
                  </button>
                  <button
                    onClick={() => setModalTab("plan")}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-semibold transition-all whitespace-nowrap ${
                      modalTab === "plan"
                        ? "bg-[var(--primary)18] text-primary"
                        : "text-text-muted hover:bg-bg hover:text-text"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> Subskrypcja
                  </button>
                  <button
                    onClick={() => setModalTab("security")}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-xs font-semibold transition-all whitespace-nowrap ${
                      modalTab === "security"
                        ? "bg-[var(--primary)18] text-primary"
                        : "text-text-muted hover:bg-bg hover:text-text"
                    }`}
                  >
                    <Lock className="w-4 h-4" /> Bezpieczeństwo
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="flex-1 flex flex-col p-6 md:p-8 bg-dash-card">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-text">
                      {modalTab === "account" && "Informacje o Twoim koncie"}
                      {modalTab === "plan" && "Twój plan i rozliczenia"}
                      {modalTab === "security" && "Logowanie i profil"}
                    </h2>
                    <p className="text-sm text-text-subtle mt-1">
                      {modalTab === "account" &&
                        "Zarządzaj swoimi danymi kontaktowymi i podglądaj statystyki."}
                      {modalTab === "plan" &&
                        "Zmieniaj pakiety i kontroluj limity wysyłanych wiadomości."}
                      {modalTab === "security" &&
                        "Zadbaj o hasła logowanie oraz szczegóły bezpieczeństwa."}
                    </p>
                  </div>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-dash-border transition-colors text-text"
                  >
                    <X className="w-5 h-5 opacity-60 hover:opacity-100" />
                  </button>
                </div>

                {/* TAB CONTENT: ACCOUNT */}
                {modalTab === "account" && (
                  <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-bold text-text">{userName}</h3>
                        <p className="text-sm text-text-muted">{userEmail}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="border border-dash-border p-4 rounded-sm bg-bg-alt">
                        <p className="text-[10px] text-text-subtle font-bold uppercase tracking-widest mb-1">
                          Rola
                        </p>
                        <p className="text-sm font-semibold text-text">
                          Administrator systemu
                        </p>
                      </div>
                      <div className="border border-dash-border p-4 rounded-sm bg-bg-alt">
                        <p className="text-[10px] text-text-subtle font-bold uppercase tracking-widest mb-1">
                          Data dołączenia
                        </p>
                        <p className="text-sm font-semibold text-text">
                          Marzec 2026
                        </p>
                      </div>
                    </div>

                    <button className="text-sm text-primary font-bold py-2 mt-4 hover:opacity-80 transition-opacity">
                      Edytuj szczegóły profilu (Wkrótce)
                    </button>
                  </div>
                )}

                {/* TAB CONTENT: PLAN */}
                {modalTab === "plan" && (
                  <div className="space-y-6 flex-1">
                    <div
                      className="rounded-sm border p-5 flex items-center justify-between"
                      style={{
                        backgroundColor: planCfg.bg,
                        borderColor: `${planCfg.color}30`,
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-sm flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: planCfg.color }}
                        >
                          <PlanIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-text capitalize">
                            Pakiet {planCfg.label}
                          </h3>
                          <p
                            className="text-sm font-medium"
                            style={{ color: planCfg.color }}
                          >
                            Aktywny
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-sm font-bold text-text mb-4">
                        Funkcje dostępne w ramach Twojego abonamentu:
                      </p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4">
                        {planCfg.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-center gap-2 text-sm text-text-muted"
                          >
                            <Check
                              className="w-4 h-4"
                              style={{ color: planCfg.color }}
                            />{" "}
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-8 pt-6 border-t border-dash-border">
                      <button
                        className="px-5 py-2.5 rounded-sm font-bold text-white text-sm transition-opacity hover:opacity-90 w-full sm:w-auto"
                        style={{ backgroundColor: "var(--primary)" }}
                      >
                        Przejdź na pełną wersję płatną
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: SECURITY */}
                {modalTab === "security" && (
                  <div className="space-y-6 flex-1">
                    <div>
                      <h3 className="text-sm font-bold text-text mb-2">
                        Zmień hasło
                      </h3>
                      <p className="text-sm text-text-muted max-w-sm mb-4">
                        Aby zmienić hasło, wyślemy na Twoją skrzynkę link
                        autoryzacyjny.
                      </p>
                      <button className="px-5 py-2.5 rounded-sm border border-dash-border font-semibold text-sm text-text hover:bg-bg-alt transition-colors">
                        Wyślij link
                      </button>
                    </div>

                    <div className="pt-6 border-t border-[var(--dash-border)] mt-6">
                      <h3 className="text-sm font-bold text-text mb-2">
                        Wyloguj ze wszystkich urządzeń
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] max-w-sm mb-4">
                        Jeśli zauważyłeś podejrzaną aktywność, wyloguj wszystkie
                        aktualnie trwające zalogowane sesje poza tą.
                      </p>
                      <button className="px-5 py-2.5 rounded-sm bg-red-500/10 text-red-500 hover:bg-red-500/20 font-semibold text-sm transition-colors">
                        Wyloguj przymusowo sesje
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
