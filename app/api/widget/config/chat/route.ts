import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { DEFAULT_SETTINGS, ChatWidgetConfig } from "@/lib/defaultSettings";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");

    if (!clientId) {
      return NextResponse.json(
        { error: "No clientId provided" },
        { status: 400 },
      );
    }

    const config = await prisma.widgetConfig.findUnique({
      where: { clientId },
      select: { extraSettings: true },
    });

    const extraSettings =
      (config?.extraSettings as unknown as Record<string, ChatWidgetConfig>) ||
      {};

    const payload: ChatWidgetConfig = {
      ...DEFAULT_SETTINGS.chat,
      ...(extraSettings.chat || {}),
    };

    const response = NextResponse.json(payload);

    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400",
    );
    response.headers.set("Access-Control-Allow-Origin", "*");

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
