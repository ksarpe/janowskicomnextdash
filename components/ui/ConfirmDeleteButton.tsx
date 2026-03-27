import { Trash } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteButtonProps {
  onConfirm: () => void;
  title?: string;
  description?: string;
  isPending?: boolean;
  /** Tekst przycisku potwierdzenia */
  confirmLabel?: string;
  /** Nadpisuje domyślny trigger (przycisk z ikoną kosza) */
  trigger?: React.ReactNode;
}

export function ConfirmDeleteButton({
  onConfirm,
  title = "Czy na pewno chcesz usunąć?",
  description = "Tej akcji nie można cofnąć.",
  isPending = false,
  confirmLabel = "Tak, usuń",
  trigger,
}: ConfirmDeleteButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger ?? (
          <Button title="Usuń" variant="destructive" size="icon" className="w-8 h-8">
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Anuluj</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? "Usuwanie..." : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
