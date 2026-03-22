// app/(dashboard)/reservations/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Reservation } from "@prisma/client";
import ReservationList from "@/components/dashboard/reservations/ReservationList";
import { getReservations } from "@/lib/queries";
import { todayStr } from "@/utils/helpers";

export default async function ReservationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const clientId = session.user.id;

  // Cached — no new DB query if data was fetched within the last 30 s
  const reservations: Reservation[] = await getReservations(clientId);
  const pendingCount = reservations.filter(
    (r) => r.status === "PENDING",
  ).length;
  const acceptedCount = reservations.filter(
    (r) => r.status === "ACCEPTED",
  ).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-7">
          <div>
            <h1 className="text-2xl font-black text-text">Harmonogram Wizyt</h1>
            <p className="text-sm text-text-muted mt-0.5 capitalize">
              {todayStr}
            </p>
          </div>
          {pendingCount > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
              style={{
                backgroundColor: "#f59e0b14",
                color: "#f59e0b",
                border: "1px solid #f59e0b30",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "#f59e0b" }}
              />
              {pendingCount} oczekujące na akceptację
            </div>
          )}
        </div>

        <ReservationList
          reservations={reservations}
          pendingCount={pendingCount}
          acceptedCount={acceptedCount}
          totalCount={reservations.length}
        />
      </div>
    </div>
  );
}
