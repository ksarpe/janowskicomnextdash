import * as React from "react";

import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  Home,
  Calendar,
  Briefcase,
  Users,
  Mail,
  Settings,
  GalleryVerticalEnd,
  Clock,
  Code,
} from "lucide-react";

const data = {
  teams: [
    {
      name: "kasperjanowski.com",
      logo: <GalleryVerticalEnd />,
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <Home />,
    },
    {
      title: "Wiadomości",
      url: "/messages",
      icon: <Mail />,
    },
    {
      title: "Kalendarz",
      url: "/appointments",
      icon: <Calendar />,
    },
    {
      title: "Usługi",
      url: "/services",
      icon: <Briefcase />,
    },
    {
      title: "Klienci",
      url: "/clients",
      icon: <Users />,
    },
    {
      title: "Godziny pracy",
      url: "/working-hours",
      icon: <Clock />,
    },
    {
      title: "Ustawienia",
      url: "/settings",
      icon: <Settings />,
    },
    {
      title: "Integracja",
      url: "/integration",
      icon: <Code />,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  plan: string;
  userName: string;
  userEmail: string;
  themeColor: string;
}

export function AppSidebar({
  plan,
  userName,
  userEmail,
  themeColor,
  ...props
}: AppSidebarProps) {
  const user = {
    name: userName,
    email: userEmail,
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" {...props}>
      <SidebarHeader className="h-14 flex items-center justify-center bg-dash-card">
        <TeamSwitcher teams={data.teams} plan={plan} />
      </SidebarHeader>
      <SidebarContent className="py-2">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} plan={plan} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
