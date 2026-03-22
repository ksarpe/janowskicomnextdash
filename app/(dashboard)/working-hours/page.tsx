import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import WorkingHoursManager from "./WorkingHoursManager";

export default async function WorkingHoursPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const clientId = session.user.id;

  const [dbHours, dbExceptions] = await Promise.all([
    prisma.workingHours.findMany({
      where: { clientId },
    }),
    prisma.blockedTime.findMany({
      where: { clientId },
      orderBy: { date: "asc" },
    }),
  ]);

  const defaultHours = Array.from({ length: 7 }, (_, i) => ({
    dayOfWeek: i,
    startTime: "08:00",
    endTime: "16:00",
    isActive: i > 0 && i < 6,
  }));
  
  const initialHours = defaultHours.map(def => {
    const found = dbHours.find(h => h.dayOfWeek === def.dayOfWeek);
    return found || def;
  });

  const initialExceptions = dbExceptions.map(ex => ({
    id: ex.id,
    date: ex.date.toISOString().split("T")[0],
    allDay: ex.allDay,
    startTime: ex.startTime,
    endTime: ex.endTime,
    label: ex.allDay 
      ? `${ex.date.toLocaleDateString("pl-PL", { day: 'numeric', month: 'long' })} - Cały dzień`
      : `${ex.date.toLocaleDateString("pl-PL", { day: 'numeric', month: 'long' })} - Od ${ex.startTime} do ${ex.endTime}`
  }));

  return <WorkingHoursManager initialHours={initialHours as any} initialExceptions={initialExceptions} />;
}
