/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['pbxt.replicate.delivery'],
  },
}

module.exports = nextConfig
