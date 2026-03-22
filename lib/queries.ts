// lib/queries.ts
// Centralised, cached data-fetching functions.
// Uses Next.js `unstable_cache` so that repeated navigation between
// dashboard tabs does NOT fire new DB queries — data is served from the
// in-process cache and revalidated only when a mutation explicitly calls
// revalidateTag() with the matching tag.
//
// Cache lifetime (revalidate): 60 s  ← safe default; mutations invalidate earlier

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

// ─── Tag helpers ──────────────────────────────────────────────────────────────
// Use these tags in revalidateTag() calls inside Server Actions / Route Handlers
export const TAGS = {
  widgetConfig: (clientId: string) => `widget-config-${clientId}`,
  clientPlan:   (clientId: string) => `client-plan-${clientId}`,
  messages:     (clientId: string) => `messages-${clientId}`,
  reservations: (clientId: string) => `reservations-${clientId}`,
  dashboardStats:(clientId: string) => `dashboard-stats-${clientId}`,
} as const;

// ─── Widget config ─────────────────────────────────────────────────────────────
export function getWidgetConfig(clientId: string) {
  return unstable_cache(
    () =>
      prisma.widgetConfig
        .findUnique({ where: { clientId } })
        .catch(() => null),
    [`widget-config-${clientId}`],
    { revalidate: 60, tags: [TAGS.widgetConfig(clientId)] },
  )();
}

// ─── Widget theme color only (used in layout) ─────────────────────────────────
export function getWidgetThemeColor(clientId: string) {
  return unstable_cache(
    async () => {
      const config = await prisma.widgetConfig
        .findUnique({
          where: { clientId },
          select: { extraSettings: true },
        })
        .catch(() => null);

      const extra   = (config?.extraSettings as Record<string, unknown>) ?? {};
      const chat    = (extra.chat as Record<string, unknown>) ?? {};
      return (chat.themeColor as string) ?? "#dd9946";
    },
    [`widget-theme-${clientId}`],
    { revalidate: 60, tags: [TAGS.widgetConfig(clientId)] },
  )();
}

// ─── Client subscription plan ─────────────────────────────────────────────────
export function getClientPlan(clientId: string) {
  return unstable_cache(
    () =>
      prisma.client
        .findUnique({
          where: { id: clientId },
          select: { subscription: true },
        })
        .then((c) => c?.subscription ?? "FREE")
        .catch(() => "FREE" as const),
    [`client-plan-${clientId}`],
    { revalidate: 60, tags: [TAGS.clientPlan(clientId)] },
  )();
}

// ─── Messages ─────────────────────────────────────────────────────────────────
export function getMessages(clientId: string) {
  return unstable_cache(
    () =>
      prisma.message
        .findMany({
          where: { clientId },
          orderBy: [{ isRead: "asc" }, { createdAt: "desc" }],
        })
        .catch(() => []),
    [`messages-${clientId}`],
    { revalidate: 30, tags: [TAGS.messages(clientId)] },
  )();
}

// ─── Reservations ─────────────────────────────────────────────────────────────
export function getReservations(clientId: string) {
  return unstable_cache(
    () =>
      prisma.reservation
        .findMany({
          where: { clientId },
          orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        })
        .catch(() => []),
    [`reservations-${clientId}`],
    { revalidate: 30, tags: [TAGS.reservations(clientId)] },
  )();
}

// ─── Dashboard stats (panel główny) ───────────────────────────────────────────
export function getDashboardStats(clientId: string) {
  return unstable_cache(
    async () => {
      const [totalMessages, unreadMessages, recentMessages, totalReservations] =
        await Promise.all([
          prisma.message.count({ where: { clientId } }).catch(() => 0),
          prisma.message.count({ where: { clientId, isRead: false } }).catch(() => 0),
          prisma.message
            .findMany({
              where: { clientId },
              orderBy: { createdAt: "desc" },
              take: 3,
            })
            .catch(() => []),
          prisma.reservation.count({ where: { clientId } }).catch(() => 0),
        ]);

      return { totalMessages, unreadMessages, recentMessages, totalReservations };
    },
    [`dashboard-stats-${clientId}`],
    {
      revalidate: 30,
      tags: [
        TAGS.dashboardStats(clientId),
        TAGS.messages(clientId),
        TAGS.reservations(clientId),
      ],
    },
  )();
}
