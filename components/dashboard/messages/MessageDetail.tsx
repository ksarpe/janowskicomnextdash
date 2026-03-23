"use client";

import { useState, useEffect, useTransition } from "react";
import { Message } from "@prisma/client";
import { Archive, Mail, Trash2, Send, Smile, Paperclip } from "lucide-react";
import { markAsRead } from "@/app/(dashboard)/messages/actions";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface Props {
  message: Message;
}

export default function MessageDetail({ message }: Props) {
  const [reply, setReply] = useState("");
  const [sent, setSent] = useState(false);
  const [, startTransition] = useTransition();

  // Mark as read only once when this message is first displayed
  useEffect(() => {
    if (!message.isRead) {
      startTransition(() => {
        markAsRead(message.id);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message.id]);

  function handleSendReply() {
    if (!reply.trim()) return;
    // Placeholder — would call an email / reply API
    setSent(true);
    setReply("");
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Message header */}
      <div
        className="px-6 py-4 border-b flex items-center justify-between"
        style={{ borderColor: "var(--dash-border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black shrink-0"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {getInitials(message.senderName)}
          </div>
          <div>
            <p className="text-sm font-bold text-text">{message.senderName}</p>
            <p className="text-xs text-text-muted">
              {message.senderEmail} · via Chat Widget
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            className="p-2 rounded-sm text-text-muted hover:bg-bg-alt transition-colors"
            title="Archiwizuj"
          >
            <Archive className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-sm text-text-muted hover:bg-bg-alt transition-colors"
            title="Wyślij email"
          >
            <Mail className="w-4 h-4" />
          </button>
          <button
            className="p-2 rounded-sm text-red-400 hover:bg-red-50 transition-colors"
            title="Usuń"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Message body */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <p
          className="text-[10px] font-black uppercase tracking-widest mb-3"
          style={{ color: "var(--primary)" }}
        >
          Treść wiadomości
        </p>

        <p className="text-lg font-black text-text mb-4 leading-snug">
          {message.senderEmail}
        </p>

        <div
          className="text-sm text-text leading-relaxed whitespace-pre-wrap p-5 rounded-sm border"
          style={{
            backgroundColor: "var(--dash-bg)",
            borderColor: "var(--dash-border)",
          }}
        >
          {message.content}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span
            className="text-[11px] font-bold px-3 py-1 rounded-full"
            style={{
              backgroundColor: message.isRead
                ? "#22c55e18"
                : "var(--primary)1a",
              color: message.isRead ? "#22c55e" : "var(--primary)",
            }}
          >
            {message.isRead ? "✓ Przeczytana" : "● Nowa"}
          </span>
          <span className="text-xs text-text-subtle">
            {new Date(message.createdAt).toLocaleDateString("pl-PL", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Reply box */}
      <div
        className="px-6 py-4 border-t"
        style={{ borderColor: "var(--dash-border)" }}
      >
        {sent && (
          <div className="mb-3 px-4 py-2.5 rounded-sm bg-emerald-50 border border-emerald-200 text-sm text-emerald-700 font-medium">
            ✓ Odpowiedź wysłana!
          </div>
        )}
        <div
          className="rounded-sm border"
          style={{ borderColor: "var(--dash-border)" }}
        >
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Wpisz odpowiedź tutaj..."
            rows={3}
            className="w-full px-4 pt-3 text-sm text-text placeholder-text-subtle resize-none focus:outline-none rounded-t-2xl"
            style={{ backgroundColor: "transparent" }}
          />
          <div
            className="px-3 py-2 flex items-center justify-between border-t"
            style={{ borderColor: "var(--dash-border)" }}
          >
            <div className="flex items-center gap-1">
              <button className="p-1.5 rounded-sm text-text-muted hover:text-text hover:bg-bg-alt transition-colors">
                <Paperclip className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-sm text-text-muted hover:text-text hover:bg-bg-alt transition-colors">
                <Smile className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleSendReply}
              disabled={!reply.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-sm text-white text-xs font-bold transition-all disabled:opacity-40"
              style={{ backgroundColor: "var(--primary)" }}
            >
              Wyślij <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
