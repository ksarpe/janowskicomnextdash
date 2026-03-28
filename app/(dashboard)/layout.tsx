// app/(dashboard)/layout.tsx
import { auth } from "@/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getClientPlan, getWidgetThemeColor } from "@/lib/queries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const userName = session?.user?.name || "";
  const userEmail = session?.user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();
  const clientId = session?.user?.id ?? "";

  // Cached — no repeated DB hits when switching tabs
  const [plan, themeColor] = clientId
    ? await Promise.all([
        getClientPlan(clientId),
        getWidgetThemeColor(clientId),
      ])
    : ["FREE" as const, "#dd9946"];

  return (
    <DashboardShell
      userName={userName}
      userEmail={userEmail}
      plan={plan}
      themeColor={themeColor}
    >
      <div className="p-8 w-full mx-auto h-full overflow-y-auto">
        {children}
      </div>
    </DashboardShell>
  );
}
