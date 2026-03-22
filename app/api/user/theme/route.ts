// app/api/user/theme/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { TAGS } from "@/lib/queries";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const clientId = session.user.id;

  const body = await req.json();
  const { themeColor } = body;

  if (!themeColor || !/^#[0-9a-fA-F]{6}$/.test(themeColor)) {
    return NextResponse.json({ error: "Invalid color" }, { status: 400 });
  }

  // Fetch existing config
  const config = await prisma.widgetConfig.findUnique({
    where: { clientId },
  });

  if (!config) {
    return NextResponse.json({ error: "Config not found" }, { status: 404 });
  }

  const existing = (config.extraSettings as Record<string, unknown>) ?? {};

  // Merge themeColor into chat widget settings
  const chat = (existing.chat as Record<string, unknown>) ?? {};
  const updated = {
    ...existing,
    chat: {
      ...chat,
      themeColor,
    },
  };

  await prisma.widgetConfig.update({
    where: { clientId },
    data: { extraSettings: updated },
  });

  // @ts-expect-error Next.js Canary typings mismatch
  revalidateTag(TAGS.widgetConfig(clientId));

  return NextResponse.json({ ok: true });
}
