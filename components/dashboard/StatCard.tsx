import { ArrowUpRight, TrendingUp } from "lucide-react";
import Link from "next/link";

export function StatCard({
  label,
  value,
  icon: Icon,
  link,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  link?: string;
}) {
  return (
    <div
      className="rounded-2xl p-4 border flex flex-col gap-3 relative overflow-hidden"
      style={{
        backgroundColor: "var(--dash-card)",
        borderColor: "var(--dash-border)",
      }}
    >
      <div className="flex justify-between items-center">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ color: "var(--primary)" }}
        >
          <Icon className="w-4.5 h-4.5" />
        </div>
        {link && (
          <Link href={link}>
            <ArrowUpRight className="w-5 h-5 opacity-60 cursor-pointer hover:bg-primary/40 rounded-sm" />
          </Link>
        )}
      </div>
      <div>
        <p className="text-xs text-text-muted font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-black text-text">{value}</p>
      </div>
    </div>
  );
}
