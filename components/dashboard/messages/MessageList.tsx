"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Message } from "@prisma/client";

function timeAgo(date: Date): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return "Teraz";
  if (mins < 60) return `${mins} min temu`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Wczoraj";
  return new Date(date).toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function statusBadge(isRead: boolean) {
  if (!isRead)
    return (
      <span
        className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
        style={{ backgroundColor: "var(--primary)1a", color: "var(--primary)" }}
      >
        Nowe
      </span>
    );
  return (
    <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
      Przeczytane
    </span>
  );
}

interface Props {
  messages: Message[];
  selectedId: string | null;
  unreadCount: number;
}

export default function MessageList({ messages, selectedId, unreadCount }: Props) {
  const router = useRouter();

  function selectMessage(id: string) {
    router.push(`/messages?selected=${id}`);
  }

  return (
    <div
      className="w-72 shrink-0 border-r flex flex-col"
      style={{ borderColor: "var(--dash-border)", backgroundColor: "var(--dash-sidebar)" }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{ borderColor: "var(--dash-border)" }}
      >
        <p className="text-[10px] font-black uppercase tracking-widest text-text-subtle">
          Zapytania
        </p>
        {unreadCount > 0 && (
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {unreadCount} Nowe
          </span>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-sm text-text-subtle">Brak wiadomości</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isSelected = msg.id === selectedId;
            return (
              <button
                key={msg.id}
                onClick={() => selectMessage(msg.id)}
                className="w-full text-left px-4 py-3.5 border-b transition-colors"
                style={{
                  borderColor: "var(--dash-border)",
                  backgroundColor: isSelected ? "var(--primary)0d" : "transparent",
                  borderLeft: isSelected
                    ? "3px solid var(--primary)"
                    : "3px solid transparent",
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-bold text-text truncate leading-tight">
                    {msg.senderName}
                  </p>
                  <span className="text-[10px] text-text-subtle whitespace-nowrap shrink-0 mt-0.5">
                    {timeAgo(msg.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-text-muted mb-1.5 truncate">{msg.senderEmail}</p>
                <div className="flex items-center gap-2">
                  {statusBadge(msg.isRead)}
                  <p className="text-[11px] text-text-subtle truncate">{msg.content.slice(0, 40)}...</p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
