import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

// No path needed — next-intl v4 auto-detects i18n/request.ts
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http" as const,
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https" as const,
        hostname: "api.99min.com",
        pathname: "/uploads/**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default withNextIntl(nextConfig);