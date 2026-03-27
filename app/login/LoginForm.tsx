"use client";

import { useState } from "react";
import { loginUser } from "./actions";
import { LogIn, AlertCircle } from "lucide-react";

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);

    try {
      const result = await loginUser(formData);
      if (result?.error) {
        setError(result.error);
        setIsPending(false);
      }
    } catch (error) {
      window.location.href = "/";
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 bg-bg border border-border rounded-sm text-text placeholder-text-subtle focus:outline-none focus:ring-2 focus:border-transparent transition-all sm:text-sm";

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
            style={{ ["--tw-ring-color" as any]: "var(--primary)" }}
            placeholder="kontakt@twojafirma.pl"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-muted mb-1.5 flex justify-between">
            Hasło
            <a
              href="#"
              className="font-normal text-sm"
              style={{ color: "var(--primary)" }}
            >
              Zapomniałeś?
            </a>
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
        className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-sm transition-all disabled:opacity-60 shadow-lg"
        style={{
          backgroundColor: "var(--primary)",
          boxShadow: "0 4px 14px var(--primary)50",
        }}
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

      <div className="mt-6 text-center text-sm text-text-muted">
        Nie masz konta?{" "}
        <a
          href="/register"
          className="font-medium"
          style={{ color: "var(--primary)" }}
        >
          Zarejestruj się
        </a>
      </div>
    </form>
  );
}
