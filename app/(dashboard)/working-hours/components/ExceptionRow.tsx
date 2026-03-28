import { CalendarOff, Trash } from "lucide-react";
import { ConfirmDeleteButton } from "@/components/ui/ConfirmDeleteButton";
import { Button } from "@/components/ui/Button";

interface Exception {
  id: string;
  date: string;
  allDay: boolean;
  startTime: string | null;
  endTime: string | null;
  label: string;
  title: string | null;
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
    <div className="flex mb-2 items-center justify-between px-4 py-2 bg-dash-card transition-all rounded-sm shadow-sm">
      <div className="flex items-start gap-3">
        <CalendarOff className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
        <div className="flex flex-col">
          <span className="font-bold text-text text-[15px]">
            {exception.label}
          </span>
          {exception.title && (
            <span className="text-sm text-text-muted/80 leading-snug font-medium mt-0.5 max-w-md line-clamp-2">
              {exception.title}
            </span>
          )}
        </div>
      </div>
      <ConfirmDeleteButton
        onConfirm={() => handleDeleteException(exception.id)}
        title="Czy na pewno chcesz usunąć ten wyjątek?"
        description="Tej akcji nie można cofnąć. Wyjątek zostanie trwale usunięty."
        confirmLabel="Tak, usuń wyjątek"
        trigger={
          <Button title="Usuń" variant="ghost">
            <Trash className="w-4 h-4 text-red-500" />
          </Button>
        }
      />
    </div>
  );
}
