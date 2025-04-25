import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  // Tambahkan konfigurasi ESLint di sini
  eslint: {
    // Nonaktifkan pemeriksaan ESLint selama build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;