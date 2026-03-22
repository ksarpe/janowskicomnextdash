"use server";

import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { TAGS } from "@/lib/queries";

export async function acceptReservation(id: string) {
  const res = await prisma.reservation.update({
    where: { id },
    data: { status: "ACCEPTED" },
  });
  // @ts-expect-error Next.js Canary typings mismatch
  revalidateTag(TAGS.reservations(res.clientId));
  // @ts-expect-error Next.js Canary typings mismatch
  revalidateTag(TAGS.dashboardStats(res.clientId));
  revalidatePath("/reservations");
}

export async function rejectReservation(id: string) {
  const res = await prisma.reservation.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
  // @ts-expect-error Next.js Canary typings mismatch
  revalidateTag(TAGS.reservations(res.clientId));
  // @ts-expect-error Next.js Canary typings mismatch
  revalidateTag(TAGS.dashboardStats(res.clientId));
  revalidatePath("/reservations");
}
