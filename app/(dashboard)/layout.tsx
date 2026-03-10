import Link from "next/link";
import { LayoutDashboard, MessageSquare, Settings, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Pasek Boczny (Sidebar) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <span className="text-xl font-bold text-cyan-600">Janowski SaaS</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/" className="flex items-center gap-3 p-3 rounded-lg bg-cyan-50 text-cyan-700 font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Pulpit
          </Link>
          <Link href="/wiadomosci" className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <MessageSquare className="w-5 h-5" />
            Wiadomości (Czat)
          </Link>
          <Link href="/ustawienia" className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
            <Settings className="w-5 h-5" />
            Konfiguracja Widgetu
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="flex items-center gap-3 p-3 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-5 h-5" />
            Wyloguj
          </button>
        </div>
      </aside>

      {/* Główna zawartość (tutaj renderują się podstrony) */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}