// app/(dashboard)/messages/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Mail } from "lucide-react";
import MessageList from "@/components/dashboard/messages/MessageList";
import MessageDetail from "@/components/dashboard/messages/MessageDetail";
import { getMessages } from "@/lib/queries";

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ selected?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const clientId = session.user.id;

  const params = await searchParams;
  const selectedId = params.selected ?? null;

  // Cached — same request-deduplication as in dashboard stats
  const messages = await getMessages(clientId);
  const unreadCount = messages.filter((m) => !m.isRead).length;

  // Auto-select first unread message if none selected
  const autoSelected = selectedId
    ? (messages.find((m) => m.id === selectedId) ?? null)
    : (messages.find((m) => !m.isRead) ?? messages[0] ?? null);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel — message list */}
      <MessageList
        messages={messages}
        selectedId={autoSelected?.id ?? null}
        unreadCount={unreadCount}
      />

      {/* Right panel — message detail */}
      <div
        className="flex-1 flex flex-col overflow-hidden"
        style={{ backgroundColor: "var(--dash-card)" }}
      >
        {autoSelected ? (
          <MessageDetail message={autoSelected} />
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center gap-4 p-12">
            <div
              className="w-16 h-16 rounded-sm flex items-center justify-center"
              style={{ backgroundColor: "var(--primary)14" }}
            >
              <Mail className="w-7 h-7" style={{ color: "var(--primary)" }} />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-text mb-1">
                {messages.length === 0
                  ? "Brak wiadomości"
                  : "Wybierz wiadomość"}
              </p>
              <p className="text-sm text-text-muted max-w-xs">
                {messages.length === 0
                  ? "Gdy ktoś wyśle wiadomość przez Twój widget, zobaczysz ją tutaj."
                  : "Kliknij wiadomość po lewej, aby ją przeczytać."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
