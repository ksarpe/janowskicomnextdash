import { CalendarOff } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/ui/ConfirmDeleteButton";

interface Exception {
  id: string;
  date: string;
  allDay: boolean;
  startTime: string | null;
  endTime: string | null;
  label: string;
}

interface ExceptionRowProps {
  exception: Exception;
  handleDeleteException: (id: string) => Promise<void>;
}

export function ExceptionRow({
  exception,
  handleDeleteException,
}: ExceptionRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-dash-card rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] transition-all">
      <span className="font-bold text-text text-[15px] flex items-center gap-3">
        <CalendarOff className="w-4 h-4 text-red-500" />
        {exception.label}
      </span>
      <ConfirmDeleteButton
        onConfirm={() => handleDeleteException(exception.id)}
        title="Czy na pewno chcesz usunąć ten wyjątek?"
        description="Tej akcji nie można cofnąć. Wyjątek zostanie trwale usunięty."
        confirmLabel="Tak, usuń wyjątek"
      />
    </div>
  );
}
