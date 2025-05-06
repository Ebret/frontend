/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable image optimization
  images: {
    domains: ['localhost', 'example.com', 'cooperative-ewallet.com'], // Add your image domains here
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
  },

  // Internationalization configuration
  i18n: {
    // These are all the locales you want to support
    locales: ['en', 'fil', 'ceb', 'ilo'],
    // Default locale
    defaultLocale: 'en',
    // Auto-detect user locale based on browser settings
    localeDetection: true,
  },

  // Enable compression
  compress: true,

  // Configure build output
  output: 'standalone',

  // Configure webpack
  webpack: (config, { dev, isServer }) => {
    // Add your webpack configurations here

    // Example: Add bundle analyzer in production build
    if (!dev && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: '../bundle-analysis/client.html',
          openAnalyzer: false,
        })
      );
    }

    return config;
  },

  // Configure headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },

  // Configure redirects
  async redirects() {
    return [
      // Add your redirects here
    ];
  },

  // Configure rewrites
  async rewrites() {
    return [
      // Add your rewrites here
    ];
  },

  // Configure environment variables
  env: {
    // Add your environment variables here
  },

  // Configure experimental features
  experimental: {
    // Enable server components
    serverComponents: true,

    // Enable concurrent features
    concurrentFeatures: true,

    // Enable optimistic updates
    optimisticClientCache: true,

    // Enable app directory
    appDir: true,
  },
};

module.exports = nextConfig;
