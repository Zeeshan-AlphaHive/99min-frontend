import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local development
      {
        protocol: "http" as const,
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      // Production API
      {
        protocol: "https" as const,
        hostname: "api.99min.com",
        pathname: "/uploads/**",
      },
      // Render deployed backend
      {
        protocol: "https" as const,
        hostname: "nine9-min-backend.onrender.com",
        pathname: "/uploads/**",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default withNextIntl(nextConfig);