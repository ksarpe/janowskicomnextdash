"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { HelpCircle, Menu, X } from "lucide-react";
import SidebarNav from "@/components/dashboard/SidebarNav";
import UserProfilePanel from "@/components/dashboard/UserProfilePanel";

interface Props {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
  userInitial: string;
  plan: string;
  themeColor: string;
  logoutForm: React.ReactNode;
}

export default function DashboardShell({
  children,
  userName,
  userEmail,
  userInitial,
  plan,
  themeColor,
  logoutForm,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar whenever the route changes (user tapped a nav link)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile sidebar open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div
        className="px-5 py-5 border-b"
        style={{ borderColor: "var(--dash-border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-text leading-none">
              JANOWSKI TECH LOGO
            </p>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-bg-alt transition-colors lg:hidden shrink-0"
            aria-label="Zamknij menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nav */}
      <SidebarNav userPlan={plan} />

      {/* User profile panel — replaces old static footer */}
      <UserProfilePanel
        userName={userName}
        userEmail={userEmail}
        userInitial={userInitial}
        plan={plan}
        themeColor={themeColor}
        logoutForm={logoutForm}
      />
    </>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: "var(--dash-bg)" }}
    >
      {/* ── DESKTOP sidebar — always visible ────────────────────────────────── */}
      <aside
        className="hidden lg:flex w-60 flex-col shrink-0 border-r"
        style={{
          backgroundColor: "var(--dash-sidebar)",
          borderColor: "var(--dash-border)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── MOBILE sidebar — slide in overlay ───────────────────────────────── */}
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundColor: "var(--dash-sidebar)",
          borderColor: "var(--dash-border)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* ── Main area ────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top bar */}
        <header
          className="h-14 shrink-0 border-b flex items-center justify-between px-4 md:px-6"
          style={{
            backgroundColor: "var(--dash-sidebar)",
            borderColor: "var(--dash-border)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-bg-alt transition-colors lg:hidden"
              aria-label="Otwórz menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button className="hidden sm:flex p-2 rounded-lg text-text-muted hover:text-text hover:bg-bg-alt transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-hidden"
          style={{ backgroundColor: "var(--dash-bg)" }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
