"use client";

import { useState } from "react";
import { Code, Terminal, Send, CheckCircle2, Copy } from "lucide-react";

interface IntegrationFormProps {
  clientId: string;
}

export default function IntegrationForm({ clientId }: IntegrationFormProps) {
  const [activeTab, setActiveTab] = useState<"html" | "next" | "dev">("html");
  const [copied, setCopied] = useState(false);

  const widgetUrl = "https://twojadomena.pl/chat-widget.js";

  const codes = {
    html: `<!-- Wklej ten kod przed zamknięciem tagu </body> -->\n<script src="${widgetUrl}" data-client-id="${clientId}"></script>`,
    next: `// Z użyciem Next.js <Script>\nimport Script from 'next/script';\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="pl">\n      <body>\n        {children}\n        <Script\n          src="${widgetUrl}"\n          data-client-id="${clientId}"\n          strategy="lazyOnload"\n        />\n      </body>\n    </html>\n  );\n}`,
    dev: `Cześć,\n\nProszę dodaj poniższy kod na naszej stronie internetowej. Należy go umieścić tuż przed zamknięciem tagu </body>:\n\n<script src="${widgetUrl}" data-client-id="${clientId}"></script>\n\nDzięki!`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codes[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Zakładki */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab("html")}
          className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === "html"
              ? "border-cyan-500 text-cyan-600 bg-cyan-50/30"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Code className="w-4 h-4" />
          Zwykła strona (HTML)
        </button>
        <button
          onClick={() => setActiveTab("next")}
          className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === "next"
              ? "border-cyan-500 text-cyan-600 bg-cyan-50/30"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Terminal className="w-4 h-4" />
          Next.js / React
        </button>
        <button
          onClick={() => setActiveTab("dev")}
          className={`flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors ${
            activeTab === "dev"
              ? "border-cyan-500 text-cyan-600 bg-cyan-50/30"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Send className="w-4 h-4" />
          Wyślij do programisty
        </button>
      </div>

      {/* Zawartość zakładki */}
      <div className="p-6">
        {activeTab === "html" && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Instrukcja instalacji w kodzie HTML
            </h3>
            <p className="text-gray-600 text-sm">
              Skopiuj poniższy kod i wklej go do kodu swojej strony
              internetowej, tuż przed miejscem w którym zamyka się tag{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded text-cyan-600">
                &lt;/body&gt;
              </code>
              .
            </p>
          </div>
        )}

        {activeTab === "next" && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Instrukcja dla Next.js (App Router)
            </h3>
            <p className="text-gray-600 text-sm">
              Użyj komponentu{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded text-cyan-600">
                &lt;Script&gt;
              </code>{" "}
              dostarczanego przez Next.js, aby asynchronicznie załadować skrypt
              bez blokowania renderowania strony. Najlepiej umieścić go w
              głównym pliku{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded font-mono">
                layout.tsx
              </code>
              .
            </p>
          </div>
        )}

        {activeTab === "dev" && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Gotowa wiadomość e-mail
            </h3>
            <p className="text-gray-600 text-sm">
              Jeżeli nie zarządzasz kodem samodzielnie, po prostu skopiuj
              poniższą treść i wyślij ją osobie technicznej, która opiekuje się
              Twoją stroną internetową.
            </p>
          </div>
        )}

        <div className="relative group mt-6">
          <div className="absolute right-4 top-4">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Skopiowano!" : "Kopiuj"}
            </button>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-6 pt-12 rounded-xl overflow-x-auto text-sm font-mono whitespace-pre-wrap">
            {codes[activeTab]}
          </pre>
        </div>
      </div>
    </div>
  );
}
