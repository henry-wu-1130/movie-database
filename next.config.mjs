/** @type {import('next').NextConfig} */

import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
};

export default withSentryConfig(nextConfig, {
  org: 'hen-li-wu',
  project: 'javascript-react',

  // Pass the auth token
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Only print logs for uploading source maps in CI
  // Set to `true` to suppress logs
  silent: !process.env.CI,
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  tunnelRoute: true, // Generates a random route for each build (recommended)
});
