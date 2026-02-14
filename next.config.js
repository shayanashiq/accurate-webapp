/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zeus.accurate.id',
      },
    ],
  },
}

module.exports = nextConfig
