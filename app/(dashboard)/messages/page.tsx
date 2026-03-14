// src/app/(dashboard)/wiadomosci/page.tsx
import { prisma } from "@/lib/db";
import { MessageSquare, Mail, Clock } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Message } from "@prisma/client";

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
      <h1 className="text-3xl font-bold text-text mb-8">Skrzynka odbiorcza</h1>

      <div className="bg-bg-alt rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <MessageSquare className="w-5 h-5" style={{ color: "var(--primary)" }} />
            Wszystkie konwersacje
          </h2>
        </div>

        <div className="divide-y divide-border">
          {messages.length === 0 ? (
            <p className="p-8 text-center text-text-muted">
              Brak wiadomości. Twój widget czeka na klientów!
            </p>
          ) : (
            messages.map((msg: Message) => (
              <div
                key={msg.id}
                className="p-6 transition-colors"
                style={{
                  backgroundColor: !msg.isRead ? "var(--primary)08" : undefined,
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    {!msg.isRead && (
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--primary)" }}
                      />
                    )}
                    <span className="font-semibold text-text">{msg.senderName}</span>
                    <span className="flex items-center gap-1 text-sm text-text-muted">
                      <Mail className="w-3 h-3" /> {msg.senderEmail}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-text-subtle font-medium">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.createdAt).toLocaleDateString("pl-PL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-text-muted mt-3 whitespace-pre-wrap text-sm leading-relaxed">
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
