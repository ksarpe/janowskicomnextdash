// app/(dashboard)/page.tsx
import { getDashboardStats } from "@/lib/queries";
import { MessageSquare, Eye, Users, Activity } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { StatCard } from "@/components/dashboard/StatCard";
import { ScheduleBox } from "@/components/dashboard/ScheduleBox";
import { ActivityBox } from "@/components/dashboard/ActivityBox";
import { WidgetBox } from "@/components/dashboard/WidgetBox";

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const clientId = session.user.id;

  // Cached — served from in-process cache on repeated navigations
  const { unreadMessages, recentMessages, totalReservations } =
    await getDashboardStats(clientId);

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 max-w-full mx-auto">
        {/* Stats row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Nowe wiadomości"
            value={unreadMessages}
            icon={MessageSquare}
            link="/messages"
          />
          <StatCard
            label="Rezerwacje"
            value={totalReservations}
            icon={Activity}
            link="/reservations"
          />
          <StatCard
            label="Aktywnych klientów"
            value="1"
            icon={Users}
            link="/clients"
          />
          <StatCard label="Miesięczne wyświetlenia" value="—" icon={Eye} />
        </div>

        {/* Three-column grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <ActivityBox recentMessages={recentMessages} />
          <ScheduleBox />
          <WidgetBox />
        </div>
      </div>
    </div>
  );
}
