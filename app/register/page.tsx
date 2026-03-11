import RegisterForm from "./RegisterForm";
import { MessageSquare } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user?.id) {
    redirect("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 font-sans relative overflow-hidden">
      {/* Bardziej subtelne tło zamiast krzykliwych kolorów */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Delikatna siatka w tle dla efektu 'technicznego' */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Świecący punkt za formularzem na górze */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[100px] rounded-full"></div>
      </div>

      <div
        className="w-full z-10 p-6 flex flex-col items-center mx-auto"
        style={{ maxWidth: "400px" }}
      >
        <div className="text-center mb-8 flex flex-col items-center w-full">
          <div className="w-16 h-16 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center justify-center mb-5 text-cyan-600">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Zarejestruj konto
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Panel zarządzania systemem Janowski SaaS
          </p>
        </div>

        <div className="w-full bg-white p-8 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] border border-gray-100">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
