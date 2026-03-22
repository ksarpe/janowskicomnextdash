import { Appointment } from "@prisma/client";
import { getInitials, formatDate } from "@/utils/helpers";
import { Clock, Phone, MoreVertical, Check, X } from "lucide-react";
import { useTransition } from "react";
import {
  acceptAppointment,
  rejectAppointment,
} from "@/app/(dashboard)/appointments/actions";
import { Status, STATUS_CONFIG } from "./definitions";

// ── ActionButton ──────────────────────────────────────────────────────────────
function ActionButton({
  appointmentId,
  type,
}: {
  appointmentId: string;
  type: "accept" | "reject";
}) {
  const [isPending, startTransition] = useTransition();

  const isAccept = type === "accept";

  function handleClick() {
    startTransition(async () => {
      if (isAccept) {
        await acceptAppointment(appointmentId);
      } else {
        await rejectAppointment(appointmentId);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
      style={
        isAccept
          ? { backgroundColor: "#22c55e18", color: "#22c55e" }
          : { backgroundColor: "#ef444418", color: "#ef4444" }
      }
    >
      {isPending ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : isAccept ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <X className="w-3.5 h-3.5" />
      )}
    </button>
  );
}

// ── AppointmentRow ─────────────────────────────────────────────────────────────
export function AppointmentRow({ res }: { res: Appointment }) {
  const status = res.status as Status;
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const isPending = status === "PENDING";

  return (
    <tr
      className="border-b group transition-colors hover:bg-primary/2"
      style={{ borderColor: "var(--dash-border)" }}
    >
      {/* Client */}
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0"
            style={{ backgroundColor: "var(--primary)" }}
          >
            {getInitials(res.customerName)}
          </div>
          <div>
            <p className="text-sm font-bold text-text leading-tight">
              {res.customerName}
            </p>
          </div>
        </div>
      </td>

      {/* Date & Time */}
      <td className="py-4 px-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-semibold text-text">
            {formatDate(res.date)}
          </p>
          <p className="text-xs text-text-muted flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {res.startTime}
          </p>
        </div>
      </td>

      {/* Phone */}
      <td className="py-4 px-4">
        <p className="text-sm text-text-muted flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 shrink-0" />
          {res.customerPhone}
        </p>
      </td>

      {/* Price */}
      <td className="py-4 px-4">
        <p className="text-sm font-black text-text">{res.price ?? "—"}</p>
      </td>

      {/* Status */}
      <td className="py-4 px-4">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: cfg.bg, color: cfg.color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: cfg.dot }}
          />
          {cfg.label}
        </span>
      </td>

      {/* Actions */}
      <td className="py-4 px-4">
        {isPending ? (
          <div className="flex items-center gap-2">
            <ActionButton appointmentId={res.id} type="accept" />
            <ActionButton appointmentId={res.id} type="reject" />
          </div>
        ) : (
          <button className="p-1.5 rounded-lg text-text-subtle hover:text-text hover:bg-bg-alt transition-colors opacity-0 group-hover:opacity-100">
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
        )}
      </td>
    </tr>
  );
}
