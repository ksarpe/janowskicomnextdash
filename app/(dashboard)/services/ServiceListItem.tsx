import { Clock, Banknote, Edit, Trash, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ConfirmDeleteButton } from "@/components/ui/ConfirmDeleteButton";
import { Switch } from "@/components/ui/switch";
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
    // Main container representing a single service row
    <div className="flex items-start gap-3.5 w-full">
      {/* Service graphic representation */}
      <div className="p-2 bg-primary/10 rounded-md text-primary shrink-0">
        <ServiceIcon name={service.iconName} className="w-5 h-5" />
      </div>

      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Row: Name, Description, and Switch */}
        <div className="flex items-start justify-between gap-4 w-full">
          <div className="flex flex-col min-w-0">
            {/* Name + Status Tag */}
            <h4 className="font-bold text-text flex items-center gap-2 text-lg flex-wrap">
              {service.name}
              {/* Show 'Inactive' tag if the service is explicitly turned off */}
              {!service.isActive && (
                <span className="text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 shrink-0">
                  Wyłączona
                </span>
              )}
            </h4>

            {/* Temporary Service Description */}
            <p className="text-sm text-text-muted mt-1 leading-snug max-w-lg">
              Krótki opis tej usługi, który pomoże klientom w podjęciu decyzji
              podczas procesu rezerwacji.
            </p>
          </div>

          {/* Toggle switch for service active status */}
          <div className="shrink-0 mt-0.5">
            <Switch
              checked={service.isActive}
              onCheckedChange={() => onToggle(service.id, service.isActive)}
              disabled={isPending}
              title={service.isActive ? "Wyłącz usługę" : "Włącz usługę"}
              size="lg"
            />
          </div>
        </div>

        {/* Bottom Row: Details and Action buttons */}
        <div className="flex items-center justify-between mt-4">
          {/* Service detail counters */}
          <div className="flex items-center gap-5 text-[13px] font-medium text-text-muted">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 opacity-70" />
              <span className="text-text">{service.duration} min</span>
            </span>
            {service.price && (
              <span className="flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-green-600 opacity-90" />
                <span className="text-text">{service.price} PLN</span>
              </span>
            )}
          </div>

          {/* Edit and Delete buttons */}
          <div className="flex items-center gap-1">
            <Button
              onClick={() => onEdit(service)}
              title="Edytuj"
              variant="ghost"
              disabled={isPending}
            >
              <Edit2 className="w-4 h-4" />
            </Button>

            <ConfirmDeleteButton
              onConfirm={() => onDelete(service.id)}
              title="Czy na pewno chcesz usunąć tę usługę?"
              description="Upewnij się, że nie ma do niej przypisanych aktywnych rezerwacji. Tej akcji nie można cofnąć, a usługa zniknie z widżetu rezerwacji."
              confirmLabel="Tak, usuń usługę"
              isPending={isPending}
              trigger={
                <Button title="Usuń" variant="ghost" disabled={isPending}>
                  <Trash className="w-4 h-4 text-red-500" />
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
