"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChevronsUpDownIcon,
  SparklesIcon,
  BadgeCheckIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  ChevronRight,
} from "lucide-react";
import UserProfilePanel from "./dashboard/UserProfilePanel";
import { logoutAction } from "@/app/(dashboard)/actions";

export function NavUser({
  user,
  plan,
}: {
  user: {
    name: string;
    email: string;
  };
  plan: string;
}) {
  const { isMobile } = useSidebar();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<"account" | "plan" | "security">(
    "account",
  );

  const openModal = (tab: "account" | "plan" | "security") => {
    setModalTab(tab);
    setModalOpen(true);
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-hover data-[state=open]:text-sidebar-hover-foreground cursor-pointer"
              >
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronRight className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-sm"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => openModal("plan")}
                  className="bg-primary/20"
                >
                  <SparklesIcon />
                  Ulepsz do{" "}
                  {plan === "FREE" ? "Grow" : plan === "GROW" ? "ULTRA" : ""}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => openModal("account")}>
                  <BadgeCheckIcon />
                  Moje konto
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openModal("plan")}>
                  <CreditCardIcon />
                  Subskrypcja
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openModal("security")}>
                  <BellIcon />
                  Powiadomienia i bezpieczeństwo
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <form action={logoutAction} className="w-full">
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2"
                  >
                    <LogOutIcon className="size-4" />
                    Wyloguj się
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <UserProfilePanel
        userName={user.name}
        userEmail={user.email}
        plan={plan}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        modalTab={modalTab}
        setModalTab={setModalTab}
      />
    </>
  );
}
