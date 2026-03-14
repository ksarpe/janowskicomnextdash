import { redirect } from "next/navigation";
import { auth } from "@/auth";
import IntegrationForm from "./IntegrationForm";

export default async function IntegrationPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/login");
  }
  const clientId = session.user.id;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text">Integracja na stronie</h1>
        <p className="text-text-muted mt-2">
          Wybierz sposób w jaki chcesz dodać czat do swojej strony, a następnie
          skopiuj odpowiedni kod.
        </p>
      </div>

      <IntegrationForm clientId={clientId} />
    </div>
  );
}
