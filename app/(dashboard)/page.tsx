// src/app/(dashboard)/page.tsx
import { prisma } from "@/lib/db";
import { MessageSquare, Activity, Code } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }
  const clientId = session.user.id;

  const totalMessages = await prisma.message.count({
    where: { clientId: clientId },
  });

  const unreadMessages = await prisma.message.count({
    where: { clientId: clientId, isRead: false },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text">Pulpit główny</h1>
        <p className="text-text-muted mt-2">
          Witaj z powrotem! Oto podsumowanie Twojego widżetu.
        </p>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-bg-alt p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-xl"
              style={{ backgroundColor: "var(--primary)18", color: "var(--primary)" }}
            >
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-text-muted font-medium">Wszystkie wiadomości</p>
              <p className="text-2xl font-bold text-text">{totalMessages}</p>
            </div>
          </div>
        </div>

        <div className="bg-bg-alt p-6 rounded-2xl border border-border">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-500/10 text-red-400">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-text-muted font-medium">Nieprzeczytane</p>
              <p className="text-2xl font-bold text-text">{unreadMessages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kod integracyjny */}
      <div className="bg-bg-alt rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <Code className="w-5 h-5 text-text-muted" />
            Kod integracyjny
          </h2>
        </div>
        <div className="p-6">
          <p className="text-text-muted mb-4 text-sm">
            Kod integracyjny oraz instrukcje instalacji widżetu zostały
            przeniesione do osobnej zakładki.
          </p>
          <Link
            href="/integration"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "var(--primary)" }}
          >
            Przejdź do instrukcji integracji
          </Link>
        </div>
      </div>
    </div>
  );
}
