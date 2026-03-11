// src/app/(dashboard)/page.tsx
import { prisma } from "@/lib/db";
import { MessageSquare, Activity, Code } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // W przyszłości pobierzesz to z sesji użytkownika
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }
  const clientId = session.user.id;

  // Pobieramy statystyki
  const totalMessages = await prisma.message.count({
    where: { clientId: clientId },
  });

  const unreadMessages = await prisma.message.count({
    where: { clientId: clientId, isRead: false },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pulpit główny</h1>
        <p className="text-gray-500 mt-2">
          Witaj z powrotem! Oto podsumowanie Twojego widżetu.
        </p>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Wszystkie wiadomości
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalMessages}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Nieprzeczytane
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {unreadMessages}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Szybka Instalacja - Przełączono do zakładki integration */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Code className="w-5 h-5 text-gray-500" />
            Kod integracyjny
          </h2>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-4 text-sm">
            Kod integracyjny oraz instrukcje instalacji widżetu zostały
            przeniesione do osobnej zakładki.
          </p>
          <Link
            href="/integration"
            className="inline-flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition"
          >
            Przejdź do instrukcji integracji
          </Link>
        </div>
      </div>
    </div>
  );
}
