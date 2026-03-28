"use client";

import { useState, useTransition, useOptimistic } from "react";
import { Plus, Banknote, Loader2, Download, Search } from "lucide-react";
import {
  addService,
  updateService,
  toggleServiceActive,
  deleteService,
} from "@/app/api/widget/booking/actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Service, ServiceFormData } from "./definitions";
import { ServiceForm } from "./ServiceForm";
import { ServiceListItem } from "./ServiceListItem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ServiceManager({
  initialServices,
}: {
  initialServices: Service[];
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
    setIsAdding(false);
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
    setEditingId(null);
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

  const filteredServices = optimisticServices.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-8 w-full mx-auto">
        <div className="flex justify-between items-start md:items-center mb-4 flex-col md:flex-row gap-4">
          <div>
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-text">Usługi</h1>
                {isPending && (
                  <Loader2 className="w-5 h-5 text-text-muted animate-spin" />
                )}
              </div>
              <p className="text-sm text-text-muted text-medium">
                Zarządzaj swoją ofertą i cennikiem oferowanych usług.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Wyszukiwarka */}
            <div className="relative flex items-center group">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Szukaj usługi..."
                className={`peer h-9 w-9 px-0 cursor-pointer rounded-md border border-dash-border bg-dash-bg pl-9 text-sm outline-none transition-all duration-300 hover:border-text-muted/50 focus:w-64 focus:cursor-text focus:border-primary focus:ring-1 focus:ring-primary ${
                  searchQuery
                    ? "w-64 cursor-text"
                    : "placeholder:text-transparent focus:placeholder:text-text-muted"
                }`}
              />
              <Search className="pointer-events-none absolute left-2.5 w-4 h-4 text-text-muted transition-colors group-hover:text-text peer-focus:text-primary" />
            </div>

            <Button
              onClick={() => setIsAdding(true)}
              variant="default"
              disabled={isPending}
            >
              <Plus className="w-4 h-4" />
              Dodaj usługę
            </Button>
            <Button onClick={() => {}} variant="outline" disabled={isPending}>
              <Download className="w-4 h-4" />
              Pobierz raport
            </Button>
          </div>
        </div>

        {/* Main container with services */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 transition-all duration-200 ${isPending ? "opacity-80" : "opacity-100"}`}
        >
          {/* Empty State */}
          {optimisticServices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 border border-dashed rounded-sm bg-(--dash-card)/50">
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
          {/* No search results state */}
          {filteredServices.length === 0 && optimisticServices.length > 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 border border-dashed rounded-sm bg-(--dash-card)/50 md:col-span-2 lg:col-span-2 xl:col-span-3">
              <Search className="w-8 h-8 text-text-muted/50 mb-1" />
              <p className="text-sm font-bold text-text">Brak wyników</p>
              <p className="text-xs text-text-muted">
                Nie znaleziono usług pasujących do "{searchQuery}"
              </p>
            </div>
          )}

          {/* List of services */}
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`p-4 rounded-sm border shadow-sm ${
                service.isActive
                  ? "bg-dash-card"
                  : "bg-dash-bg opacity-70 grayscale-30"
              }`}
            >
              <ServiceListItem
                service={service}
                onToggle={handleToggle}
                onEdit={(s) => setEditingId(s.id)}
                onDelete={handleDelete}
                isPending={isPending}
              />
            </div>
          ))}

          {/* Add Service Button Card */}
          <button
            onClick={() => setIsAdding(true)}
            disabled={isPending}
            className="flex flex-col items-center justify-center gap-3 p-4 min-h-[170px] rounded-sm border-2 border-dashed border-dash-border hover:border-primary/50 hover:bg-primary/5 transition-all text-text-muted hover:text-primary group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="p-3 bg-dash-bg rounded-md group-hover:bg-primary/10 transition-colors border shadow-sm group-hover:shadow-md">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold mt-1">
              Kliknij aby dodać usługę.
            </span>
          </button>
        </div>

        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogContent className="max-w-2xl bg-dash-bg border-dash-card">
            <DialogHeader>
              <DialogTitle>Nowa usługa</DialogTitle>
              <DialogDescription>
                Dodaj nową usługę określając jej nazwę, czas trwania oraz cenę.
              </DialogDescription>
            </DialogHeader>
            <ServiceForm
              onSubmit={handleAddSubmit}
              onCancel={() => setIsAdding(false)}
              isSubmitting={isPending}
              submitText="Dodaj usługę"
              className="flex flex-col gap-4 mt-2"
            />
          </DialogContent>
        </Dialog>

        <Dialog
          open={!!editingId}
          onOpenChange={(open) => !open && setEditingId(null)}
        >
          <DialogContent className="max-w-2xl bg-dash-bg border-dash-card">
            <DialogHeader>
              <DialogTitle>Edytuj usługę</DialogTitle>
              <DialogDescription>
                Wprowadź poprawki i zapisz zmiany.
              </DialogDescription>
            </DialogHeader>
            {(() => {
              const editingService = optimisticServices.find(
                (s) => s.id === editingId,
              );
              if (!editingService) return null;
              return (
                <ServiceForm
                  initialData={{
                    name: editingService.name,
                    duration: editingService.duration,
                    price: editingService.price || "",
                    iconName: editingService.iconName || "Wrench",
                  }}
                  onSubmit={(data) => handleEditSubmit(data, editingService)}
                  onCancel={() => setEditingId(null)}
                  isSubmitting={isPending}
                  submitText="Zapisz zmiany"
                  className="flex flex-col gap-4 mt-2"
                />
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
