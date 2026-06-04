import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
};

/** Apply PWA wrapper only for production builds — avoids Turbopack/dev conflicts. */
export default process.env.NODE_ENV === "production" ? withPWA(nextConfig) : nextConfig;
