"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Plus, Banknote, Loader2 } from "lucide-react";
import {
  addService,
  updateService,
  toggleServiceActive,
  deleteService,
} from "@/app/api/widget/booking/actions";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Service, ServiceFormData } from "./definitions";
import { ServiceForm } from "./ServiceForm";
import { ServiceListItem } from "./ServiceListItem";

export default function ServiceManager({
  initialServices,
}: {
  initialServices: Service[];
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Optimistic UI state
  const [optimisticServices, addOptimisticService] = useOptimistic(
    initialServices,
    (state, action: { type: string; payload: any }) => {
      switch (action.type) {
        case "ADD":
          return [...state, action.payload];
        case "EDIT":
          return state.map((s) =>
            s.id === action.payload.id ? { ...s, ...action.payload } : s,
          );
        case "DELETE":
          return state.filter((s) => s.id !== action.payload.id);
        case "TOGGLE":
          return state.map((s) =>
            s.id === action.payload.id ? { ...s, isActive: !s.isActive } : s,
          );
        default:
          return state;
      }
    },
  );

  const handleAddSubmit = (data: ServiceFormData) => {
    startTransition(async () => {
      addOptimisticService({
        type: "ADD",
        payload: {
          id: `temp-${Date.now()}`,
          name: data.name,
          duration: data.duration,
          price: data.price || "",
          iconName: data.iconName || "",
          isActive: true, // by default new services are active
        },
      });
      setIsAdding(false);
      try {
        await addService({
          name: data.name,
          duration: data.duration,
          price: data.price || "",
          iconName: data.iconName || "",
        });
        toast.success("Dodano usługę");
      } catch (error) {
        console.error(error);
        toast.error("Wystąpił błąd podczas dodawania usługi");
      }
    });
  };

  const handleEditSubmit = (data: ServiceFormData, service: Service) => {
    startTransition(async () => {
      addOptimisticService({
        type: "EDIT",
        payload: {
          id: service.id,
          name: data.name,
          duration: data.duration,
          price: data.price || "",
          iconName: data.iconName || "",
        },
      });
      setEditingId(null);
      try {
        await updateService(service.id, {
          name: data.name,
          duration: data.duration,
          price: data.price || "",
          iconName: data.iconName || "",
          isActive: service.isActive,
        });
        toast.success("Zapisano zmiany");
      } catch (error) {
        console.error(error);
        toast.error("Wystąpił błąd podczas edycji usługi");
      }
    });
  };

  const handleToggle = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      addOptimisticService({
        type: "TOGGLE",
        payload: { id },
      });
      try {
        await toggleServiceActive(id, !currentStatus);
        toast.success("Status usługi został zmieniony");
      } catch (error) {
        console.error(error);
        toast.error("Wystąpił błąd podczas zmiany statusu");
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      addOptimisticService({
        type: "DELETE",
        payload: { id },
      });
      try {
        await deleteService(id);
        toast.success("Usługa usunięta");
      } catch (error) {
        console.error(error);
        toast.error("Wystąpił błąd podczas usuwania usługi");
      }
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 w-full mx-auto">
        <div className="flex justify-between items-start md:items-center mb-8 flex-col md:flex-row gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-medium text-text">Usługi</h1>
              {isPending && (
                <Loader2 className="w-5 h-5 text-text-muted animate-spin" />
              )}
            </div>
            <p className="text-sm text-text-muted mt-0.5 max-w-md">
              Zarządzaj ofertą, którą widzą Twoi klienci w widżecie rezerwacji.
              Określ czas trwania, aby kalendarz poprawnie blokował terminy.
            </p>
          </div>
          {!isAdding && (
            <Button
              onClick={() => setIsAdding(true)}
              variant="default"
              disabled={isPending}
            >
              <Plus className="w-4 h-4" />
              Dodaj usługę
            </Button>
          )}
        </div>

        <div
          className={`flex flex-col gap-2 transition-all duration-200 ${isPending ? "opacity-80" : "opacity-100"}`}
        >
          {isAdding && (
            <ServiceForm
              onSubmit={handleAddSubmit}
              onCancel={() => setIsAdding(false)}
              isSubmitting={isPending}
              title="Nowa usługa"
              submitText="Dodaj usługę"
              className="p-5 rounded-sm border bg-dash-card border-dash-border flex flex-col gap-4 shadow-sm animate-in fade-in slide-in-from-top-4"
            />
          )}

          {optimisticServices.length === 0 && !isAdding && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 border border-dashed border-dash-border rounded-sm bg-(--dash-card)/50">
              <div
                className="w-14 h-14 rounded-sm flex items-center justify-center"
                style={{ backgroundColor: "var(--primary)10" }}
              >
                <Banknote
                  className="w-6 h-6"
                  style={{ color: "var(--primary)" }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-text mb-1">Brak usług</p>
                <p className="text-xs text-text-muted max-w-xs">
                  Dodaj pierwszą usługę, aby klienci mogli się na nią umawiać w
                  widżecie.
                </p>
              </div>
            </div>
          )}

          {optimisticServices.map((service) => (
            <div
              key={service.id}
              className={`p-4 rounded-sm border transition-all ${
                service.isActive
                  ? "bg-dash-card"
                  : "bg-dash-bg opacity-70 grayscale-30"
              }`}
              style={{ borderColor: "var(--dash-border)" }}
            >
              {editingId === service.id ? (
                <ServiceForm
                  initialData={{
                    name: service.name,
                    duration: service.duration,
                    price: service.price || "",
                  }}
                  onSubmit={(data) => handleEditSubmit(data, service)}
                  onCancel={() => setEditingId(null)}
                  isSubmitting={isPending}
                  submitText="Zapisz zmiany"
                />
              ) : (
                <ServiceListItem
                  service={service}
                  onToggle={handleToggle}
                  onEdit={(s) => setEditingId(s.id)}
                  onDelete={handleDelete}
                  isPending={isPending}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
