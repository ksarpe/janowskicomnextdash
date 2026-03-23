import React from "react";
import { Clock } from "lucide-react";
import { ServiceIcon } from "@/components/services/ServiceIcon";

interface Step1ServiceProps {
  initialServices: any[];
  onSelect: (service: any) => void;
  themeColor: string;
}

export function Step1Service({
  initialServices,
  onSelect,
  themeColor,
}: Step1ServiceProps) {
  return (
    <div className="flex flex-col gap-3 animate-in slide-in-from-right-8 fade-in duration-300 pb-8">
      {initialServices.map((service) => (
        <button
          key={service.id}
          onClick={() => onSelect(service)}
          className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-sm text-left hover:border-gray-400 hover:shadow-md transition-all group"
        >
          <div
            className="w-12 h-12 shrink-0 flex items-center justify-center rounded-sm bg-gray-50 border border-gray-100 text-xl group-hover:scale-110 transition-transform"
            style={{ color: themeColor }}
          >
            <ServiceIcon name={service.iconName} className="w-6 h-6" />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex justify-between items-start w-full mb-1">
              <span className="font-semibold text-gray-900 leading-tight">
                {service.name}
              </span>
            </div>
            <div className="flex justify-between items-center w-full mt-1">
              <span className="text-xs text-gray-500 flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                <Clock className="w-3 h-3" /> {service.duration} min
              </span>
              <span className="font-medium text-xs text-gray-900 bg-gray-100 px-2 py-1 rounded-md">
                {service.price || "—"}
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
