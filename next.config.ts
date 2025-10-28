import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['ih1.redbubble.net', 'images.unsplash.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3000/api/:path*',
      },
    ];
  }, 
};

module.exports = nextConfig;