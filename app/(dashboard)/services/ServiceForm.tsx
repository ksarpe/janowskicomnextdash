"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { serviceSchema, ServiceFormData } from "./definitions";
import { iconMap, ServiceIcon } from "@/components/services/ServiceIcon";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface ServiceFormProps {
  initialData?: ServiceFormData;
  onSubmit: (data: ServiceFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  title?: string;
  submitText?: string;
  className?: string;
}

export function ServiceForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  submitText = "Zapisz",
  className = "flex flex-col gap-4 animate-in fade-in",
}: ServiceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting: isFormSubmitting },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData || {
      name: "",
      duration: 30,
      price: "",
      iconName: "Wrench",
    },
  });

  const selectedIcon = watch("iconName") || "CircleDashed";

  useEffect(() => {
    if (initialData) {
      reset({ ...initialData, iconName: initialData.iconName || "Wrench" });
    }
  }, [initialData, reset]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className={className}>
        <div className="flex flex-col items-start">
          {/* Rest of the data */}
          <div className="flex flex-col w-full gap-4">
            {/* Name */}
            <div>
              <label
                htmlFor="service-name"
                className="text-xs font-semibold text-text mb-1 block"
              >
                Nazwa usługi *
              </label>
              <Input
                id="service-name"
                {...register("name")}
                placeholder="np. Wymiana oleju"
                className="w-full bg-dash-bg border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-text"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label
                htmlFor="service-duration"
                className="text-xs font-semibold text-text mb-1 block"
              >
                Czas (minuty) *
              </label>
              <Input
                type="number"
                id="service-duration"
                {...register("duration", { valueAsNumber: true })}
                className="w-full bg-dash-bg border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-text"
              />
              {errors.duration && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.duration.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="service-price"
                className="text-xs font-semibold text-text mb-1 block"
              >
                Cena (opcjonalnie)
              </label>
              <Input
                id="service-price"
                {...register("price")}
                placeholder="np. od 150 zł"
                className="w-full bg-dash-bg border rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-text"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Ikony do wyboru */}
        <div className="w-full">
          <label className="text-xs font-semibold text-text mb-2 block">
            Wybierz ikonę usługi
          </label>
          <div className="flex justify-between">
            {Object.keys(iconMap).map((iconKey) => {
              const isSelected = selectedIcon === iconKey;
              return (
                <button
                  key={iconKey}
                  type="button"
                  onClick={() =>
                    setValue("iconName", iconKey, { shouldDirty: true })
                  }
                  className={`p-3 rounded-sm border transition-all ${
                    isSelected
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-dash-bg border-dash-border text-text-muted hover:bg-dash-card hover:text-text hover:border-text-muted/50"
                  }`}
                  title={iconKey}
                >
                  <ServiceIcon name={iconKey} className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-2 border-t pt-4">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={isSubmitting || isFormSubmitting}
          >
            Anuluj
          </Button>
          <Button type="submit" disabled={isSubmitting || isFormSubmitting}>
            <Check className="w-4 h-4" /> {submitText}
          </Button>
        </div>
      </form>
    </>
  );
}
