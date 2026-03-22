"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Calendar,
  Code,
  Zap,
  Users,
  Briefcase,
  Clock,
} from "lucide-react";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Pulpit" },
  { href: "/messages", icon: MessageSquare, label: "Wiadomości" },
  { href: "/appointments", icon: Calendar, label: "Rezerwacje" },
  { href: "/clients", icon: Users, label: "Klienci" },
  { href: "/services", icon: Briefcase, label: "Usługi" },
  { href: "/working-hours", icon: Clock, label: "Godziny pracy" },
  { href: "/settings", icon: Settings, label: "Konfiguracja" },
  { href: "/integration", icon: Code, label: "Jak używać" },
];

export default function SidebarNav({ userPlan }: { userPlan: string }) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 p-3 flex flex-col justify-between">
      <div className="space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium group relative hover:bg-primary/10"
              style={
                isActive
                  ? {
                      color: "var(--primary)",
                    }
                  : { color: "var(--text-muted)" }
              }
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full"
                  style={{ backgroundColor: "var(--primary)" }}
                />
              )}
              <Icon
                className="w-4 h-4 shrink-0 transition-colors"
                style={isActive ? { color: "var(--primary)" } : {}}
              />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>

      {/* Upgrade banner */}
      <div
        className="mt-auto mx-1 mb-2 p-4 rounded-2xl text-white relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, var(--primary), var(--primary-dark))",
        }}
      >
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
        <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full bg-white/5" />
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
          {userPlan === "FREE" ? "GROW" : userPlan === "GROW" ? "ULTRA" : ""}
        </p>

        <Link
          href="/settings"
          className="flex items-center justify-center gap-1.5 w-full py-2 bg-white rounded-xl text-xs font-bold transition-opacity hover:opacity-90 relative z-10"
          style={{ color: "var(--primary-dark)" }}
        >
          <Zap className="w-3.5 h-3.5" />
          {userPlan === "FREE"
            ? "Przejdź na GROW"
            : userPlan === "GROW"
              ? "Przejdź na ULTRA"
              : "Masz już ULTRA"}
        </Link>
      </div>
    </nav>
  );
}
