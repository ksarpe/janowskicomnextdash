"use client";

import { useState } from "react";
import { registerUser } from "./actions";
import { UserPlus, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      const result = await registerUser(formData);

      if (result?.error) {
        setError(result.error);
        setIsPending(false);
      }
    } catch (error) {
      // Redirect happens in action on success, throwing NEXT_REDIRECT
      // But just in case we need to hard redirect:
      window.location.href = "/login";
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
            <UserPlus className="w-4 h-4" />
            Zarejestruj się
          </>
        )}
      </button>

      <div className="mt-6 text-center text-sm text-gray-500">
        Masz już konto?{" "}
        <a
          href="/login"
          className="font-medium text-cyan-600 hover:text-cyan-500"
        >
          Zaloguj się
        </a>
      </div>
    </form>
  );
}
