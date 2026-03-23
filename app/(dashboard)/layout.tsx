// app/(dashboard)/layout.tsx
import { signOut, auth } from "@/auth";
import { Power } from "lucide-react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { getClientPlan, getWidgetThemeColor } from "@/lib/queries";
import { Button } from "@/components/ui/Button";

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

  // Server action for logout — must live in a server component
  const logoutForm = (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <Button
        type="submit"
        title="Wyloguj"
        variant="ghost"
        className="hover:bg-red-500/20"
      >
        <Power className="w-3.5 h-3.5" />
      </Button>
    </form>
  );

  return (
    <DashboardShell
      userName={userName}
      userEmail={userEmail}
      userInitial={userInitial}
      plan={plan}
      themeColor={themeColor}
      logoutForm={logoutForm}
    >
      {children}
    </DashboardShell>
  );
}
