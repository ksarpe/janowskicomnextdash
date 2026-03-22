import { timeAgo } from "@/utils/helpers";
import { ActivityItem } from "./ActivityItem";
import { Message } from "@prisma/client";

export function ActivityBox({ recentMessages }: { recentMessages: Message[] }) {
  return (
    <div className="flex flex-col gap-5">
      <div
        className="rounded-2xl border flex-1"
        style={{
          backgroundColor: "var(--dash-card)",
          borderColor: "var(--dash-border)",
        }}
      >
        <div
          className="px-5 py-4 border-b"
          style={{ borderColor: "var(--dash-border)" }}
        >
          <h3 className="text-sm font-bold text-text">Ostatnia Aktywność</h3>
        </div>
        <div className="px-5">
          {recentMessages.length > 0 ? (
            recentMessages.map((msg) => (
              <ActivityItem
                key={msg.id}
                title={`Nowa wiadomość od ${msg.senderName}`}
                sub={msg.senderEmail}
                time={timeAgo(msg.createdAt)}
                type={!msg.isRead ? "info" : "success"}
              />
            ))
          ) : (
            <>
              <ActivityItem
                title="Brak aktywności"
                sub="Wszystkie komponenty v1.0"
                time="5 godz. temu"
                type="warning"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
