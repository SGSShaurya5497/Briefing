/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for multi-stage Docker builds (keep for when we containerise)
  output: "standalone",

  images: {
    remotePatterns: [
      // Hero section draggable cards
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // Google user avatars (for when we upgrade to Google OAuth)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
};

export default nextConfig;
