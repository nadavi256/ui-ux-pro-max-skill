import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
  experimental: {
    // Listing photos are compressed in the browser (≈200–400KB each, max 6)
    // and sent through a Server Action. Stays under Vercel's 4.5MB body cap.
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
