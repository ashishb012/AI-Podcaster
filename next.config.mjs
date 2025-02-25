/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lovely-flamingo-139.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "standing-akita-26.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
};

export default nextConfig;
