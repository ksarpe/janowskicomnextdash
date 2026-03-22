import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ServiceManager from "./ServiceManager";

export default async function ServicesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");
  const clientId = session.user.id;

  const services = await prisma.service.findMany({
    where: { clientId },
    orderBy: { name: "asc" },
  });

  return <ServiceManager initialServices={services} />;
}
