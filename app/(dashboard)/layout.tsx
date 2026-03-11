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
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Pasek Boczny (Sidebar) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-200">
          <span className="text-xl font-bold text-cyan-600">Janowski SaaS</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Pulpit
          </Link>
          <Link
            href="/messages"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Wiadomości
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Konfiguracja
          </Link>
          <Link
            href="/integration"
            className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-cyan-50 hover:text-cyan-700 transition-colors"
          >
            <Code className="w-5 h-5" />
            integration
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-3 p-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
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
