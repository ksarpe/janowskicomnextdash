// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/chat-widget.js",
        headers: [
          {
            key: "Cache-Control",
            // To jest magiczna formuła dla plików SaaS:
            value: "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*", // Zezwala na ładowanie skryptu na stronach Twoich klientów
          }
        ],
      },
    ];
  },
};

export default nextConfig;