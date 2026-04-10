// next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {},
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:80",
  },
};

export default config;
