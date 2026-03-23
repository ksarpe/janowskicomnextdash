"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface Props {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
  plan: string;
  themeColor: string;
}

export default function DashboardShell({
  children,
  userName,
  userEmail,
  plan,
  themeColor,
}: Props) {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar
          plan={plan}
          userName={userName}
          userEmail={userEmail}
          themeColor={themeColor}
        />

        <SidebarInset style={{ backgroundColor: "var(--sidebar)" }}>
          <header className="flex h-14 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <h1 className="text-xs font-medium uppercase">
                {pathname.split("/")[1]}
              </h1>
            </div>
          </header>
          <main
            className="flex-1 overflow-hidden"
            style={{ backgroundColor: "var(--dash-bg)" }}
          >
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
