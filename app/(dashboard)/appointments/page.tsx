// app/(dashboard)/appointments/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getAppointments } from "@/lib/queries";
import { todayStr } from "@/utils/helpers";
import AppointmentList from "@/components/dashboard/reservations/AppointmentList";

export default async function AppointmentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const clientId = session.user.id;

  // Cached — no new DB query if data was fetched within the last 30 s
  const appointments = await getAppointments(clientId);
  const pendingCount = appointments.filter(
    (r) => r.status === "PENDING",
  ).length;
  const acceptedCount = appointments.filter(
    (r) => r.status === "ACCEPTED",
  ).length;

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 w-full mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-md font-medium text-text-muted uppercase">
              {todayStr}
            </p>
          </div>
          {pendingCount > 0 && (
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-bold"
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

        <AppointmentList
          appointments={appointments}
          pendingCount={pendingCount}
          acceptedCount={acceptedCount}
          totalCount={appointments.length}
        />
      </div>
    </div>
  );
}
