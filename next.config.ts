import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // ✅ Skip Next.js image optimizer entirely — load images directly from source
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
      {
        protocol: "https" as const,
        hostname: "nine9-min-backend.onrender.com",
        pathname: "/uploads/**",
      },
      // Catch-all for any other backend domains
      {
        protocol: "https" as const,
        hostname: "**.onrender.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);