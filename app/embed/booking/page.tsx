import { Suspense } from "react";
import { prisma } from "@/lib/db"; // 1. Importujemy bezpośrednio Prismę!
import { DEFAULT_SETTINGS } from "@/lib/defaultSettings";
import BookingUI from "./BookingUI";
import type { Service } from "@prisma/client";

export default async function EmbeddedBookingWidget({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; config?: string }>;
}) {
  const { clientId, config } = await searchParams;

  let themeColor = DEFAULT_SETTINGS.chat.themeColor || "#000000";

  if (config) {
    try {
      const decodedString = decodeURIComponent(atob(config));
      const parsedConfig = JSON.parse(decodedString);
      if (parsedConfig.themeColor) themeColor = parsedConfig.themeColor;
    } catch (error) {
      console.error("Błąd dekodowania URL", error);
    }
  }

  // 2. NOWOŚĆ: Błyskawiczne pobranie usług na serwerze! (Kelner przynosi menu)
  let initialServices: Pick<Service, "id" | "name" | "duration" | "price">[] = [];
  let workingHours: any[] = [];
  let blockedTimes: any[] = [];
  let appointments: any[] = [];

  if (clientId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [servicesRes, hoursRes, blocksRes, apptsRes] = await Promise.all([
        prisma.service.findMany({
          where: { clientId, isActive: true },
          select: { id: true, name: true, duration: true, price: true },
          orderBy: { name: "asc" },
        }),
        prisma.workingHours.findMany({
          where: { clientId },
        }),
        prisma.blockedTime.findMany({
          where: { clientId, date: { gte: today } },
        }),
        prisma.appointment.findMany({
          where: { clientId, date: { gte: today } },
        })
      ]);
      
      initialServices = servicesRes;
      workingHours = hoursRes;
      
      blockedTimes = blocksRes.map(b => ({
        date: b.date.toISOString().split("T")[0],
        allDay: b.allDay,
        startTime: b.startTime,
        endTime: b.endTime,
      }));
      
      appointments = apptsRes.map(a => ({
        date: a.date.toISOString().split("T")[0],
        startTime: a.startTime,
        endTime: a.endTime,
        status: a.status,
      }));
    } catch (error) {
      console.error("Błąd pobierania danych z bazy:", error);
    }
  }

  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">
          Ładowanie kalendarza...
        </div>
      }
    >
      {/* 3. Przekazujemy prawdziwe dane z bazy do komponentu klienckiego */}
      <BookingUI
        clientId={clientId}
        themeColor={themeColor}
        initialServices={initialServices}
        workingHours={workingHours}
        blockedTimes={blockedTimes}
        appointments={appointments}
      />
    </Suspense>
  );
}
