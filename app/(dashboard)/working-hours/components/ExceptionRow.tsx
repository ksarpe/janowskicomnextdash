import { CalendarOff, Trash } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
    <div className="flex items-center justify-between p-4 sm:p-5 bg-dash-card border border-dash-border rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.04)] transition-all">
      <span className="font-bold text-text text-[15px] flex items-center gap-3">
        <div className="w-8 h-8 rounded-sm bg-primary/10 flex items-center justify-center shrink-0">
          <CalendarOff className="w-4 h-4 text-primary" />
        </div>
        {exception.label}
      </span>
      <Button onClick={() => handleDeleteException(exception.id)} title="Usuń">
        <Trash className="w-5 h-5 sm:w-4 sm:h-4" />
      </Button>
    </div>
  );
}
