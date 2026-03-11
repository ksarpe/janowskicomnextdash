// src/app/(dashboard)/wiadomosci/page.tsx
import { prisma } from "@/lib/db";
import { MessageSquare, Mail, Clock } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function MessagesPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }
  const clientId = session.user.id;

  const messages = await prisma.message.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Skrzynka odbiorcza
      </h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-500" />
            Wszystkie konwersacje
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {messages.length === 0 ? (
            <p className="p-8 text-center text-gray-500">
              Brak wiadomości. Twój widget czeka na klientów!
            </p>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-6 transition-colors hover:bg-gray-50 ${!msg.isRead ? "bg-cyan-50/30" : ""}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      {msg.senderName}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Mail className="w-3 h-3" /> {msg.senderEmail}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.createdAt).toLocaleDateString("pl-PL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-gray-700 mt-3 whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
