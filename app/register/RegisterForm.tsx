"use client";

import { useState } from "react";
import { registerUser } from "./actions";
import { UserPlus, AlertCircle } from "lucide-react";

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

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
      window.location.href = "/login";
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-bg border border-border rounded-sm text-text placeholder-text-subtle focus:outline-none transition-all sm:text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-sm flex items-start gap-3 text-red-400 mb-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-relaxed">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            Adres Email
          </label>
          <input
            type="email"
            name="email"
            required
            className={inputClass}
            placeholder="kontakt@twojafirma.pl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5">
            Hasło
          </label>
          <input
            type="password"
            name="password"
            required
            className={inputClass}
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-sm transition-all disabled:opacity-60"
        style={{
          backgroundColor: "var(--primary)",
          boxShadow: "0 4px 14px var(--primary)50",
        }}
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

      <div className="mt-6 text-center text-sm text-text-muted">
        Masz już konto?{" "}
        <a
          href="/login"
          className="font-medium"
          style={{ color: "var(--primary)" }}
        >
          Zaloguj się
        </a>
      </div>
    </form>
  );
}
