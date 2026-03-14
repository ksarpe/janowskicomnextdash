// src/app/(dashboard)/layout.tsx
import Link from "next/link";
import { signOut } from "@/auth";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  LogOut,
  Code,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-bg text-text overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-alt border-r border-border flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <span className="text-xl font-bold" style={{ color: "var(--primary)" }}>
            Janowski SaaS
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/", icon: LayoutDashboard, label: "Pulpit" },
            { href: "/messages", icon: MessageSquare, label: "Wiadomości" },
            { href: "/settings", icon: Settings, label: "Konfiguracja" },
            { href: "/integration", icon: Code, label: "Integracja" },
          ].map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-text transition-colors group"
              style={{ ["--hover-bg" as any]: "var(--bg-surface)" }}
            >
              <Icon className="w-5 h-5 transition-colors" />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-text-muted hover:text-red-400 transition-colors text-sm font-medium"
            >
              <LogOut className="w-5 h-5" />
              Wyloguj
            </button>
          </form>
        </div>
      </aside>

      {/* Główna zawartość */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
