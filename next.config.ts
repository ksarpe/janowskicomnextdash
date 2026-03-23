// next.config.ts
import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

const packageJson = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf-8"),
);

const nextConfig: NextConfig = {
  env: {
    APP_VERSION: packageJson.version,
  },
  async headers() {
    return [
      {
        source: "/chat-widget.js",
        headers: [
          {
            key: "Cache-Control",
            value:
              "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*", 
          },
        ],
      },
    ];
  },
};

export default nextConfig;
