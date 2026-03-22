"use server";

import { prisma } from "@/lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { TAGS } from "@/lib/queries";

export async function markAsRead(messageId: string) {
  const msg = await prisma.message.update({
    where: { id: messageId },
    data: { isRead: true },
  });
  
  // @ts-expect-error Next.js Canary typings mismatch
  revalidateTag(TAGS.messages(msg.clientId));
  // @ts-expect-error Next.js Canary typings mismatch
  revalidateTag(TAGS.dashboardStats(msg.clientId));
  revalidatePath("/messages");
}

export async function archiveMessage(messageId: string) {
  // Placeholder — can extend the schema later
  await markAsRead(messageId);
}
