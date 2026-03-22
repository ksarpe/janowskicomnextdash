// app/(dashboard)/clients/page.tsx
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";

import { getInitials, timeAgo } from "@/utils/helpers";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ClientProfile {
  key: string; // email or phone as primary key
  name: string;
  email: string | null;
  phone: string | null;
  messageCount: number;
  unreadCount: number;
  appointmentCount: number;
  acceptedAppointments: number;
  lastActivity: Date;
  firstContact: Date;
  recentMessage: string | null;
}

function getActivityLevel(
  messageCount: number,
  appointmentCount: number,
): { label: string; color: string; bg: string } {
  const total = messageCount + appointmentCount;
  if (total >= 5)
    return { label: "Aktywny", color: "#22c55e", bg: "#22c55e18" };
  if (total >= 2)
    return {
      label: "Regularny",
      color: "var(--primary)",
      bg: "var(--primary)18",
    };
  return { label: "Nowy", color: "#64748b", bg: "#64748b18" };
}

// ── StatCard ──────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-2xl border p-5 relative overflow-hidden"
      style={{
        backgroundColor: "var(--dash-card)",
        borderColor: "var(--dash-border)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
        style={{ backgroundColor: "var(--primary)14", color: "var(--primary)" }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-text-subtle mb-0.5">
        {label}
      </p>
      <p className="text-3xl font-black text-text">{value}</p>
      {sub && (
        <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1.5">
          <TrendingUp className="w-3 h-3" />
          {sub}
        </p>
      )}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{ backgroundColor: "var(--primary)20" }}
      />
    </div>
  );
}

// ── ClientRow ─────────────────────────────────────────────────────────────────
function ClientRow({ client }: { client: ClientProfile }) {
  const activity = getActivityLevel(
    client.messageCount,
    client.appointmentCount,
  );

  return (
    <tr
      className="border-b group transition-colors hover:bg-primary/2"
      style={{ borderColor: "var(--dash-border)" }}
    >
      {/* Avatar + Name */}
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {getInitials(client.name)}
          </div>
          <div>
            <p className="text-sm font-bold text-text leading-tight">
              {client.name}
            </p>
            <p className="text-[11px] text-text-subtle mt-0.5">
              Od{" "}
              {new Date(client.firstContact).toLocaleDateString("pl-PL", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </td>

      {/* Contact info */}
      <td className="py-4 px-4">
        <div className="space-y-1">
          {client.email && (
            <p className="text-xs text-text-muted flex items-center gap-1.5">
              <Mail className="w-3 h-3 shrink-0 text-text-subtle" />
              {client.email}
            </p>
          )}
          {client.phone && (
            <p className="text-xs text-text-muted flex items-center gap-1.5">
              <Phone className="w-3 h-3 shrink-0 text-text-subtle" />
              {client.phone}
            </p>
          )}
        </div>
      </td>

      {/* Activity */}
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs font-semibold text-text-muted">
            <MessageSquare className="w-3.5 h-3.5 text-text-subtle" />
            {client.messageCount}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-text-muted">
            <Calendar className="w-3.5 h-3.5 text-text-subtle" />
            {client.appointmentCount}
          </span>
        </div>
      </td>

      {/* Last activity */}
      <td className="py-4 px-4">
        <div>
          <p className="text-xs font-semibold text-text flex items-center gap-1">
            <Clock className="w-3 h-3 text-text-subtle" />
            {timeAgo(client.lastActivity)}
          </p>
          {client.recentMessage && (
            <p className="text-[11px] text-text-subtle mt-0.5 max-w-[180px] truncate">
              „{client.recentMessage}"
            </p>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: activity.bg, color: activity.color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: activity.color }}
          />
          {activity.label}
        </span>
      </td>
    </tr>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ClientsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const clientId = session.user.id;

  // Fetch all messages and appointments in parallel
  const [messages, appointments] = await Promise.all([
    prisma.message
      .findMany({ where: { clientId }, orderBy: { createdAt: "desc" } })
      .catch(() => []),
    prisma.appointment
      .findMany({ where: { clientId }, orderBy: { createdAt: "desc" } })
      .catch(() => []),
  ]);

  // ── Aggregate messages by email ──────────────────────────────────────────
  const byEmail = new Map<
    string,
    {
      name: string;
      email: string;
      count: number;
      unread: number;
      first: Date;
      last: Date;
      preview: string | null;
    }
  >();

  for (const msg of messages) {
    const key = msg.senderEmail.toLowerCase();
    const existing = byEmail.get(key);
    if (existing) {
      existing.count++;
      if (!msg.isRead) existing.unread++;
      if (new Date(msg.createdAt) > existing.last)
        existing.last = new Date(msg.createdAt);
      if (new Date(msg.createdAt) < existing.first)
        existing.first = new Date(msg.createdAt);
    } else {
      byEmail.set(key, {
        name: msg.senderName,
        email: msg.senderEmail,
        count: 1,
        unread: msg.isRead ? 0 : 1,
        first: new Date(msg.createdAt),
        last: new Date(msg.createdAt),
        preview: msg.content.slice(0, 80),
      });
    }
  }

  // ── Aggregate appointments by phone ──────────────────────────────────────
  const byPhone = new Map<
    string,
    {
      name: string;
      phone: string;
      count: number;
      accepted: number;
      first: Date;
      last: Date;
    }
  >();

  for (const res of appointments) {
    const key = res.customerPhone.replace(/\s/g, "");
    const existing = byPhone.get(key);
    if (existing) {
      existing.count++;
      if (res.status === "ACCEPTED") existing.accepted++;
      if (new Date(res.createdAt) > existing.last)
        existing.last = new Date(res.createdAt);
      if (new Date(res.createdAt) < existing.first)
        existing.first = new Date(res.createdAt);
    } else {
      byPhone.set(key, {
        name: res.customerName,
        phone: res.customerPhone,
        count: 1,
        accepted: res.status === "ACCEPTED" ? 1 : 0,
        first: new Date(res.createdAt),
        last: new Date(res.createdAt),
      });
    }
  }

  // ── Merge: try to match by name, otherwise keep separate ─────────────────
  const profiles = new Map<string, ClientProfile>();

  // Add email-based profiles first
  for (const [emailKey, data] of byEmail) {
    profiles.set(emailKey, {
      key: emailKey,
      name: data.name,
      email: data.email,
      phone: null,
      messageCount: data.count,
      unreadCount: data.unread,
      appointmentCount: 0,
      acceptedAppointments: 0,
      lastActivity: data.last,
      firstContact: data.first,
      recentMessage: data.preview,
    });
  }

  // Merge appointments — match by name if no email, else add separately
  for (const [phoneKey, data] of byPhone) {
    // Try to find an existing profile with the same normalized name
    let matched = false;
    for (const [, profile] of profiles) {
      const normalizedProfile = profile.name.toLowerCase().trim();
      const normalizedData = data.name.toLowerCase().trim();
      if (normalizedProfile === normalizedData && !profile.phone) {
        profile.phone = data.phone;
        profile.appointmentCount += data.count;
        profile.acceptedAppointments += data.accepted;
        profile.lastActivity =
          data.last > profile.lastActivity ? data.last : profile.lastActivity;
        profile.firstContact =
          data.first < profile.firstContact ? data.first : profile.firstContact;
        matched = true;
        break;
      }
    }
    if (!matched) {
      profiles.set(`phone:${phoneKey}`, {
        key: `phone:${phoneKey}`,
        name: data.name,
        email: null,
        phone: data.phone,
        messageCount: 0,
        unreadCount: 0,
        appointmentCount: data.count,
        acceptedAppointments: data.accepted,
        lastActivity: data.last,
        firstContact: data.first,
        recentMessage: null,
      });
    }
  }

  // Sort by last activity descending
  const clientList = Array.from(profiles.values()).sort(
    (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime(),
  );

  // Stats
  const totalUnread = clientList.reduce((s, c) => s + c.unreadCount, 0);
  const totalMessages = clientList.reduce((s, c) => s + c.messageCount, 0);
  const totalAppointments = clientList.reduce(
    (s, c) => s + c.appointmentCount,
    0,
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-black text-text">Klienci</h1>
          <p className="text-sm text-text-muted mt-0.5">
            Zebrane kontakty z wiadomości i rezerwacji Twojego widżetu.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Unikalnych klientów"
            value={clientList.length}
            sub="Łącznie"
            icon={Users}
          />
          <StatCard
            label="Wszystkich wiadomości"
            value={totalMessages}
            sub={
              totalUnread > 0
                ? `${totalUnread} nieprzeczytanych`
                : "Wszystkie przeczytane"
            }
            icon={MessageSquare}
          />
          <StatCard
            label="Wszystkich rezerwacji"
            value={totalAppointments}
            icon={Calendar}
          />
          <StatCard
            label="Powracających"
            value={
              clientList.filter((c) => c.messageCount + c.appointmentCount > 1)
                .length
            }
            sub="Więcej niż 1 kontakt"
            icon={Star}
          />
        </div>

        {/* Table */}
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: "var(--dash-card)",
            borderColor: "var(--dash-border)",
          }}
        >
          <div
            className="px-5 py-4 border-b flex items-center justify-between"
            style={{ borderColor: "var(--dash-border)" }}
          >
            <h3 className="text-sm font-bold text-text">Lista kontaktów</h3>
            <span className="text-xs text-text-subtle font-medium">
              {clientList.length}{" "}
              {clientList.length === 1 ? "kontakt" : "kontaktów"}
            </span>
          </div>

          {clientList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: "var(--primary)10" }}
              >
                <Users
                  className="w-6 h-6"
                  style={{ color: "var(--primary)" }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-text mb-1">
                  Brak klientów
                </p>
                <p className="text-xs text-text-muted max-w-xs">
                  Gdy ktoś wyśle wiadomość lub złoży rezerwację przez Twój
                  widget, pojawi się tutaj.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--dash-border)" }}>
                    {[
                      "Klient",
                      "Kontakt",
                      "Aktywność",
                      "Ostatni kontakt",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left text-[10px] font-black uppercase tracking-widest text-text-subtle px-4 py-2.5 first:px-5"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clientList.map((client) => (
                    <ClientRow key={client.key} client={client} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
