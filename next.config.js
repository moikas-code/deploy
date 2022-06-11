const withPWA = require('next-pwa');

const nextConfig = {
  assetPrefix: './',
  trailingSlash: true,
  reactStrictMode: true,
  pwa: {
    dest: 'public',
  },
  devIndicators: {
    autoPrerender: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  webpackDevMiddleware: (config) => {
    // Solve compiling problem via vagrant
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 800, // delay before rebuilding
    };
    return config;
  },
  async rewrites() {
    return [];
  },
  images: {
    domains: [
      'ipfs.io',
      'rarible.mypinata.cloud',
      'akkoros.mypinata.cloud',
      'ipfs.akkoros.xyz',
    ],
  },
  env: {
    NFT_STORAGE_KEY: process.env.NFT_STORAGE_KEY,
    ETHERSCAN_API: process.env.ETHERSCAN_API,
    DEV: process.env.DEV,
    AKKORO_ENV: process.env.AKKORO_ENV,
  },
};
module.exports = withPWA(nextConfig);
