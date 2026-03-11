"use client";

import { useState } from "react";
import { loginUser } from "./actions";
import { LogIn, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation"; // Dodajemy router

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  // Pozbywamy się useTransition na rzecz zwykłego stanu
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await loginUser(formData);

      // Jeśli serwer odesłał własny błąd (np. złe hasło)
      if (result?.error) {
        setError(result.error);
        setIsPending(false);
      }
    } catch (error) {
      // MAGIA: Kiedy Auth.js poprawnie Cię zaloguje, rzuci tu błąd "NEXT_REDIRECT".
      // Zamiast pozwalać Reactowi go zablokować, twardo przekierowujemy przeglądarkę:
      window.location.href = "/";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 mb-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium leading-relaxed">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Adres Email
          </label>
          <div className="relative flex items-center group">
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all sm:text-sm"
              placeholder="kontakt@twojafirma.pl"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex justify-between">
            Hasło
            <a
              href="#"
              className="font-normal text-cyan-600 hover:text-cyan-500 text-sm"
            >
              Zapomniałeś?
            </a>
          </label>
          <div className="relative flex items-center group">
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-6 group flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-70 shadow-sm"
      >
        {isPending ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Zaloguj się
          </>
        )}
      </button>

      <div className="mt-6 text-center text-sm text-gray-500">
        Nie masz konta?{" "}
        <a
          href="/register"
          className="font-medium text-cyan-600 hover:text-cyan-500"
        >
          Zarejestruj się
        </a>
      </div>
    </form>
  );
}
