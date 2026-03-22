"use server";

import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { TAGS } from "@/lib/queries";

export async function acceptAppointment(id: string) {
  const res = await prisma.appointment.update({
    where: { id },
    data: { status: "ACCEPTED" },
  });
  // @ts-expect-error Next.js Canary typings mismatch
  revalidateTag(TAGS.appointments(res.clientId));
  // @ts-expect-error Next.js Canary typings mismatch
  revalidateTag(TAGS.dashboardStats(res.clientId));
  revalidatePath("/appointments");
}

export async function rejectAppointment(id: string) {
  const res = await prisma.appointment.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
  // @ts-expect-error Next.js Canary typings mismatch
  revalidateTag(TAGS.appointments(res.clientId));
  // @ts-expect-error Next.js Canary typings mismatch
  revalidateTag(TAGS.dashboardStats(res.clientId));
  revalidatePath("/appointments");
}
