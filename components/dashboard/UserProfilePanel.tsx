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
  userInitial: string;
  plan: string;
  themeColor?: string;
  logoutForm: React.ReactNode;
}

export default function UserProfilePanel({
  userName,
  userEmail,
  userInitial,
  plan,
  logoutForm,
}: Props) {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"account" | "plan" | "security">(
    "account",
  );
  const [isDark, setIsDark] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
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

  // Initialize theme
  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  // Close popup on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      // Don't close if modal is open
      if (modalOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, modalOpen]);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (modalOpen) {
          setModalOpen(false);
        } else {
          setOpen(false);
        }
      }
    }
    if (open || modalOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, modalOpen]);

  function toggleTheme() {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  }

  function openModal(tab: "account" | "plan" | "security") {
    setModalTab(tab);
    setModalOpen(true);
    setOpen(false); // Close the small popup
  }

  return (
    <>
      {/* ── Popup Panel Trigger ───────────────────────────────────────────────── */}
      <div className="relative" ref={panelRef}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="w-full px-4 py-3.5 flex items-center gap-3 transition-colors rounded-none hover:brightness-95 group"
          style={{
            borderTop: "1px solid var(--dash-border)",
            backgroundColor: open ? "var(--primary)08" : "transparent",
          }}
        >
          <div
            className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-offset-1 transition-all"
            style={{
              backgroundColor: "var(--primary)",
            }}
          >
            {userInitial}
          </div>
          <div className="flex flex-col truncate flex-1 min-w-0 text-left">
            <span className="text-xs font-semibold text-text truncate">
              {userName}
            </span>
            <span className="text-[10px] text-text-muted truncate flex items-center gap-1">
              <PlanIcon
                className="w-2.5 h-2.5 shrink-0"
                style={{ color: planCfg.color }}
              />
              Plan {planCfg.label}
            </span>
          </div>
          <ChevronRight
            className={`w-3.5 h-3.5 text-text-subtle shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
          />
        </button>

        {/* Backdrop for Popup */}
        <div
          className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-200 ${
            open && !modalOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />

        {/* Popup Panel */}
        <div
          className={`fixed bottom-4 left-4 z-50 w-[300px] rounded-2xl border shadow-2xl overflow-hidden transition-all duration-300 ${
            open && !modalOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95 pointer-events-none"
          }`}
          style={{
            backgroundColor: "var(--dash-card)",
            borderColor: "var(--dash-border)",
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between border-b"
            style={{ borderColor: "var(--dash-border)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-black"
                style={{ backgroundColor: "var(--primary)" }}
              >
                {userInitial}
              </div>
              <div>
                <p className="text-sm font-bold text-text">{userName}</p>
                <p className="text-[11px] text-text-muted truncate max-w-[150px]">
                  {userEmail}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-bg-alt transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Actions */}
          <div
            className="p-2 border-b"
            style={{ borderColor: "var(--dash-border)" }}
          >
            <button
              onClick={() => openModal("account")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-text hover:text-text hover:bg-bg-alt transition-colors"
            >
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-zinc-500/10 text-zinc-500">
                <User className="w-3.5 h-3.5" />
              </div>
              Informacje o koncie
            </button>
            <button
              onClick={() => openModal("plan")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-text hover:text-text hover:bg-bg-alt transition-colors"
            >
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-emerald-500/10 text-emerald-500">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              Zarządzaj subskrypcją
            </button>
            <button
              onClick={() => openModal("security")}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-text hover:text-text hover:bg-bg-alt transition-colors"
            >
              <div className="w-6 h-6 rounded-md flex items-center justify-center bg-blue-500/10 text-blue-500">
                <Lock className="w-3.5 h-3.5" />
              </div>
              Zmiana hasła i profil
            </button>
          </div>

          {/* Theme switcher */}
          <div
            className="px-5 py-4 border-b flex items-center justify-between"
            style={{ borderColor: "var(--dash-border)" }}
          >
            <div className="flex items-center gap-2">
              {isDark ? (
                <Moon className="w-4 h-4 text-text-muted" />
              ) : (
                <Sun className="w-4 h-4 text-text-muted" />
              )}
              <span className="text-xs font-semibold text-text">
                Tryb {isDark ? "ciemny" : "jasny"}
              </span>
            </div>
            {/* Simple pill switch */}
            <div
              role="button"
              onClick={toggleTheme}
              className={`w-10 h-6 rounded-full flex items-center transition-all p-1 cursor-pointer ${isDark ? "bg-[var(--primary)]" : "bg-slate-300"}`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${isDark ? "translate-x-4" : "translate-x-0"}`}
              />
            </div>
          </div>

          {/* Footer: logout */}
          <div className="px-5 py-3 flex items-center justify-between">
            <p className="text-[10px] text-text-subtle">Wersja 1.0.0</p>
            <div className="flex items-center gap-2">{logoutForm}</div>
          </div>
        </div>
      </div>

      {/* ── Central Modal Overlay ─────────────────────────────────────────────── */}
      {mounted && createPortal(
        <div
          className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-300 ${
          modalOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
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
          <div className="w-full md:w-56 p-5 border-b md:border-b-0 md:border-r border-[var(--dash-border)] bg-[var(--bg-alt)] shrink-0">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#71717a]">
                Ustawienia
              </h3>
            </div>

            <div className="flex flex-row md:flex-col gap-1 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setModalTab("account")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  modalTab === "account"
                    ? "bg-[var(--primary)18] text-[var(--primary)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-text"
                }`}
              >
                <User className="w-4 h-4" /> Info o koncie
              </button>
              <button
                onClick={() => setModalTab("plan")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  modalTab === "plan"
                    ? "bg-[var(--primary)18] text-[var(--primary)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-text"
                }`}
              >
                <CreditCard className="w-4 h-4" /> Subskrypcja
              </button>
              <button
                onClick={() => setModalTab("security")}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  modalTab === "security"
                    ? "bg-[var(--primary)18] text-[var(--primary)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-text"
                }`}
              >
                <Lock className="w-4 h-4" /> Bezpieczeństwo
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="flex-1 flex flex-col p-6 md:p-8 bg-[var(--dash-card)]">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-text">
                  {modalTab === "account" && "Informacje o Twoim koncie"}
                  {modalTab === "plan" && "Twój plan i rozliczenia"}
                  {modalTab === "security" && "Logowanie i profil"}
                </h2>
                <p className="text-sm text-[var(--text-subtle)] mt-1">
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
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--dash-border)] transition-colors text-text"
              >
                <X className="w-5 h-5 opacity-60 hover:opacity-100" />
              </button>
            </div>

            {/* TAB CONTENT: ACCOUNT */}
            {modalTab === "account" && (
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg"
                    style={{ backgroundColor: "var(--primary)" }}
                  >
                    {userInitial}
                  </div>
                  <div>
                    <h3 className="font-bold text-text">{userName}</h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {userEmail}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="border border-[var(--dash-border)] p-4 rounded-2xl bg-[var(--bg-alt)]">
                    <p className="text-[10px] text-[var(--text-subtle)] font-bold uppercase tracking-widest mb-1">
                      Rola
                    </p>
                    <p className="text-sm font-semibold text-text">
                      Administrator systemu
                    </p>
                  </div>
                  <div className="border border-[var(--dash-border)] p-4 rounded-2xl bg-[var(--bg-alt)]">
                    <p className="text-[10px] text-[var(--text-subtle)] font-bold uppercase tracking-widest mb-1">
                      Data dołączenia
                    </p>
                    <p className="text-sm font-semibold text-text">
                      Marzec 2026
                    </p>
                  </div>
                </div>

                <button className="text-sm text-[var(--primary)] font-bold py-2 mt-4 hover:opacity-80 transition-opacity">
                  Edytuj szczegóły profilu (Wkrótce)
                </button>
              </div>
            )}

            {/* TAB CONTENT: PLAN */}
            {modalTab === "plan" && (
              <div className="space-y-6 flex-1">
                <div
                  className="rounded-2xl border p-5 flex items-center justify-between"
                  style={{
                    backgroundColor: planCfg.bg,
                    borderColor: `${planCfg.color}30`,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0"
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
                        className="flex items-center gap-2 text-sm text-[var(--text-muted)]"
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

                <div className="mt-8 pt-6 border-t border-[var(--dash-border)]">
                  <button
                    className="px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90 w-full sm:w-auto"
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
                  <p className="text-sm text-[var(--text-muted)] max-w-sm mb-4">
                    Aby zmienić hasło, wyślemy na Twoją skrzynkę link
                    autoryzacyjny.
                  </p>
                  <button className="px-5 py-2.5 rounded-xl border border-[var(--dash-border)] font-semibold text-sm text-text hover:bg-[var(--bg-alt)] transition-colors">
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
                  <button className="px-5 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 font-semibold text-sm transition-colors">
                    Wyloguj przymusowo sesje
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body)}
    </>
  );
}
