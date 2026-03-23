import { Clock, Banknote, Power, Edit, Trash } from "lucide-react";
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
import { Service } from "./definitions";
import { ServiceIcon } from "@/components/services/ServiceIcon";

interface ServiceListItemProps {
  service: Service;
  onToggle: (id: string, currentStatus: boolean) => void;
  onEdit: (service: Service) => void;
  onDelete: (id: string) => void;
  isPending: boolean;
}

export function ServiceListItem({
  service,
  onToggle,
  onEdit,
  onDelete,
  isPending,
}: ServiceListItemProps) {
  return (
    <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
      <div className="flex-1 min-w-[200px]">
        <div className="flex items-center gap-2">
          {/* Piękne renderowanie dynamicznej ikony */}
          <div className="p-2 bg-primary/10 rounded-sm text-primary">
            <ServiceIcon name={service.iconName} className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-text flex items-center gap-2.5 text-base">
            {service.name}
            {!service.isActive && (
              <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md bg-red-500/10 text-red-500">
                Wyłączona
              </span>
            )}
          </h4>
        </div>

        <div className="flex items-center gap-5 mt-2.5 text-xs font-medium text-text-muted">
          <span className="flex items-center gap-1.5 opacity-80">
            <Clock className="w-4 h-4" /> {service.duration} min
          </span>
          {service.price && (
            <span className="flex items-center gap-1.5 opacity-80">
              <Banknote className="w-4 h-4" /> {service.price}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={() => onToggle(service.id, service.isActive)}
          className={`${
            service.isActive
              ? "text-red-500 hover:bg-red-500/10"
              : "text-green-500 hover:bg-green-500/10"
          }`}
          variant="outline"
          title={service.isActive ? "Wyłącz" : "Włącz"}
        >
          <Power className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => onEdit(service)}
          title="Edytuj"
          variant="outline"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button title="Usuń" variant="outline">
              <Trash className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Czy na pewno chcesz usunąć tę usługę?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Upewnij się, że nie ma do niej przypisanych aktywnych
                rezerwacji. Tej akcji nie można cofnąć, a usługa zniknie z
                widżetu rezerwacji.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {/* Zwykłe zamknięcie modala - nic nie robi oprócz schowania okna */}
              <AlertDialogCancel disabled={isPending}>Anuluj</AlertDialogCancel>

              {/* Akcja właściwa - tutaj wywołujemy nasze oczyszczone handleDelete */}
              <AlertDialogAction
                onClick={() => onDelete(service.id)}
                disabled={isPending}
                className="bg-red-600 hover:bg-red-700 text-white" // Destrukcyjna akcja powinna być czerwona
              >
                {isPending ? "Usuwanie..." : "Tak, usuń usługę"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
