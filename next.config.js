/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'zeus.accurate.id', // ✅ Accurate API domain
      'localhost', // Local development
    ],
    // Ya agar remotePatterns use karna chahte ho (recommended for Next.js 13+)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zeus.accurate.id',
        pathname: '/accurate/files/**', // ✅ Specific path allow karo
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
