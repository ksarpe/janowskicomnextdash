"use client";

import { useState, useEffect } from "react";
import { Code, Terminal, Send, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface IntegrationFormProps {
  clientId: string;
}

export default function IntegrationForm({ clientId }: IntegrationFormProps) {
  const [activeTab, setActiveTab] = useState<"html" | "next" | "dev">("html");
  const [copied, setCopied] = useState(false);
  const [widgetUrl, setWidgetUrl] = useState(
    "https://twojadomena.pl/chat-widget.js",
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWidgetUrl(`${window.location.origin}/chat-widget.js`);
    }
  }, []);

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

  const tabs = [
    { id: "html" as const, label: "Zwykła strona (HTML)", icon: Code },
    { id: "next" as const, label: "Next.js / React", icon: Terminal },
    { id: "dev" as const, label: "Wyślij do programisty", icon: Send },
  ];

  const descriptions: Record<string, { title: string; text: React.ReactNode }> =
    {
      html: {
        title: "Instrukcja instalacji w kodzie HTML",
        text: (
          <>
            Skopiuj poniższy kod i wklej go do kodu swojej strony internetowej,
            tuż przed{" "}
            <code
              className="bg-bg-surface px-1.5 py-0.5 rounded text-sm font-mono"
              style={{ color: "var(--primary)" }}
            >
              &lt;/body&gt;
            </code>
            .
          </>
        ),
      },
      next: {
        title: "Instrukcja dla Next.js (App Router)",
        text: (
          <>
            Użyj komponentu{" "}
            <code
              className="bg-bg-surface px-1.5 py-0.5 rounded text-sm font-mono"
              style={{ color: "var(--primary)" }}
            >
              &lt;Script&gt;
            </code>{" "}
            dostarczanego przez Next.js w głównym pliku{" "}
            <code className="bg-bg-surface px-1.5 py-0.5 rounded text-sm font-mono text-text-muted">
              layout.tsx
            </code>
            .
          </>
        ),
      },
      dev: {
        title: "Gotowa wiadomość e-mail",
        text: "Jeżeli nie zarządzasz kodem samodzielnie, skopiuj poniższą treść i wyślij ją osobie technicznej, która opiekuje się Twoją stroną.",
      },
    };

  return (
    <div className="bg-bg-alt rounded-sm border border-border overflow-hidden">
      {/* Zakładki */}
      <div className="flex border-b border-border">
        {tabs.map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            onClick={() => setActiveTab(id)}
            className="flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors"
            style={{
              borderColor: activeTab === id ? "var(--primary)" : "transparent",
              color: activeTab === id ? "var(--primary)" : "var(--text-muted)",
              backgroundColor:
                activeTab === id ? "var(--primary)0a" : "transparent",
            }}
            variant="ghost"
          >
            <Icon className="w-4 h-4" />
            {label}
          </Button>
        ))}
      </div>

      {/* Zawartość zakładki */}
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-base font-semibold text-text mb-2">
            {descriptions[activeTab].title}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">
            {descriptions[activeTab].text}
          </p>
        </div>

        <div className="relative">
          <div className="absolute right-4 top-4 z-10">
            <Button onClick={handleCopy} variant="outline">
              {copied ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              {copied ? "Skopiowano!" : "Kopiuj"}
            </Button>
          </div>
          <pre className="bg-bg p-6 pt-12 rounded-xl overflow-x-auto text-sm font-mono whitespace-pre-wrap text-text-muted border border-border">
            {codes[activeTab]}
          </pre>
        </div>
      </div>
    </div>
  );
}
