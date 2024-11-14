/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      loaders: {
        '.svg': ['@svgr/webpack'],
      },
      resolveAlias: {
        '@': './src',
      },
    },
    optimizeCss: true,
    serverActions: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig 