import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

function setCorsHeaders(res: NextResponse, origin: string) {
  res.headers.set("Access-Control-Allow-Origin", origin);
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") || "*";
  return setCorsHeaders(new NextResponse(null, { status: 204 }), origin);
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin") || "";
    const body = await request.json();
    const { clientId, name, email, message } = body;

    // 1. Sprawdzamy, czy klient ma aktywny abonament i pobieramy jego config
    const config = await prisma.widgetConfig.findUnique({
      where: { clientId },
      include: { client: true },
    });

    if (!config || !config.client.isActive) {
      return NextResponse.json({ error: "Konto nieaktywne" }, { status: 403 });
    }

    // 2. Weryfikacja domeny (Magia bezpieczeństwa!)
    // Sprawdzamy, czy domena, z której przyszło zapytanie, jest w tablicy allowedDomains
    const isDomainAllowed = config.allowedDomains.some((domain) =>
      origin.startsWith(domain),
    );

    if (!isDomainAllowed) {
      return NextResponse.json(
        { error: "Brak uprawnień dla tej domeny: " + origin },
        { status: 403 },
      );
    }

    // 3. Zapis do bazy
    await prisma.message.create({
      data: {
        clientId,
        senderName: name,
        senderEmail: email,
        content: message,
      },
    });

    return setCorsHeaders(NextResponse.json({ success: true }), origin);
  } catch (error) {
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}
