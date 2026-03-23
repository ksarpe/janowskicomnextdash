import LoginForm from "./LoginForm";
import { MessageSquare } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg text-text font-sans relative overflow-hidden">
      {/* Tło z siatką */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]" />
        {/* Złoty glow za formularzem */}
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, #d1965230 0%, transparent 70%)",
          }}
        />
      </div>

      <div
        className="w-full z-10 p-6 flex flex-col items-center mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <div className="text-center mb-8 flex flex-col items-center w-full">
          <div
            className="w-16 h-16 bg-bg-alt border border-border rounded-sm flex items-center justify-center mb-5"
            style={{ color: "var(--primary)" }}
          >
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-text">
            Zaloguj się
          </h2>
          <p className="text-sm text-text-muted mt-2">
            Panel zarządzania systemem Janowski SaaS
          </p>
        </div>

        <div className="w-full bg-bg-alt p-8 rounded-sm border border-border shadow-[0_0_40px_rgba(0,0,0,0.4)]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
