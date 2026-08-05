/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "spicecravings.com",
      },
    ],
  },
};

module.exports = nextConfig;