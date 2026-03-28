"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { Service, serviceSchema } from "@/app/(dashboard)/services/definitions";

export async function addService(
  data: Pick<Service, "name" | "description" | "duration" | "price" | "iconName">,
) {
  const session = await auth();
  const clientId = session?.user?.id;
  if (!clientId) throw new Error("Nie znaleziono sesji klienta");

  const validatedData = serviceSchema.parse(data);

  await prisma.service.create({
    data: {
      clientId,
      name: validatedData.name,
      description: validatedData.description || null,
      duration: validatedData.duration,
      price: validatedData.price || null,
      iconName: validatedData.iconName || null,
      isActive: true,
    },
  });

  revalidatePath("/services");
  revalidatePath("/embed/booking");
}

export async function updateService(
  id: string,
  data: Omit<Service, "id" | "clientId">,
) {
  const session = await auth();
  const clientId = session?.user?.id;
  if (!clientId) throw new Error("Nie znaleziono sesji klienta");

  const validatedData = serviceSchema.parse(data);

  await prisma.service.update({
    where: { id, clientId },
    data: {
      name: validatedData.name,
      description: validatedData.description || null,
      duration: validatedData.duration,
      price: validatedData.price || null,
      iconName: validatedData.iconName || null,
      isActive: data.isActive,
    },
  });

  revalidatePath("/services");
  revalidatePath("/embed/booking");
}

export async function toggleServiceActive(id: string, isActive: boolean) {
  const session = await auth();
  const clientId = session?.user?.id;
  if (!clientId) throw new Error("Nie znaleziono sesji klienta");

  await prisma.service.update({
    where: { id, clientId },
    data: { isActive },
  });

  revalidatePath("/services");
  revalidatePath("/embed/booking");
}

export async function deleteService(id: string) {
  const session = await auth();
  const clientId = session?.user?.id;
  if (!clientId) throw new Error("Nie znaleziono sesji klienta");

  await prisma.service.delete({
    where: { id, clientId },
  });

  revalidatePath("/services");
  revalidatePath("/embed/booking");
}

export async function updateWorkingHours(
  hours: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    isActive: boolean;
  }[],
) {
  const session = await auth();
  const clientId = session?.user?.id;
  if (!clientId) throw new Error("Nie znaleziono sesji klienta");

  await prisma.$transaction(
    hours.map((h) =>
      prisma.workingHours.upsert({
        where: {
          clientId_dayOfWeek: {
            clientId,
            dayOfWeek: h.dayOfWeek,
          },
        },
        update: {
          startTime: h.startTime,
          endTime: h.endTime,
          isActive: h.isActive,
        },
        create: {
          clientId,
          dayOfWeek: h.dayOfWeek,
          startTime: h.startTime,
          endTime: h.endTime,
          isActive: h.isActive,
        },
      }),
    ),
  );

  revalidatePath("/working-hours");
  revalidatePath("/embed/booking");
}

export async function addBlockedTime(data: {
  date: string; // Otrzyma stringa z inputa "YYYY-MM-DD"
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  title?: string;
}) {
  try {
    const session = await auth();
    const clientId = session?.user?.id;
    if (!clientId) throw new Error("Nie znaleziono sesji klienta");

    const dateObj = new Date(`${data.date}T00:00:00Z`);

    const newException = await prisma.blockedTime.create({
      data: {
        clientId: clientId,
        date: dateObj,
        allDay: data.allDay,
        startTime: data.allDay ? null : data.startTime,
        endTime: data.allDay ? null : data.endTime,
        title: data.title || null,
      },
    });

    revalidatePath("/working-hours");
    revalidatePath("/embed/booking");

    return { success: true, exception: newException };
  } catch (error) {
    console.error("Błąd podczas dodawania wyjątku:", error);
    return { success: false, error: "Nie udało się zapisać blokady." };
  }
}

export async function deleteBlockedTime(id: string) {
  try {
    const session = await auth();
    const clientId = session?.user?.id;
    if (!clientId) throw new Error("Nie znaleziono sesji klienta");

    await prisma.blockedTime.delete({
      where: { id, clientId },
    });

    revalidatePath("/working-hours");
    revalidatePath("/embed/booking");

    return { success: true };
  } catch (error) {
    console.error("Błąd podczas usuwania wyjątku:", error);
    return { success: false, error: "Nie udało się usunąć blokady." };
  }
}

export async function createAppointment(data: {
  clientId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  customerName: string;
  customerPhone: string;
}) {
  try {
    const dateObj = new Date(`${data.date}T00:00:00Z`);

    const appointment = await prisma.appointment.create({
      data: {
        clientId: data.clientId,
        serviceId: data.serviceId,
        date: dateObj,
        startTime: data.startTime,
        endTime: data.endTime,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        status: "PENDING",
      },
    });

    revalidatePath("/embed/booking");
    revalidatePath("/(dashboard)/appointments");

    return { success: true, appointment };
  } catch (error) {
    console.error("Błąd tworzenia rezerwacji:", error);
    return { success: false, error: "Nie udało się zapisać wizyty." };
  }
}
