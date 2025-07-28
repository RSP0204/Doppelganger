import type { NextConfig } from 'next';

import initializeBundleAnalyzer from '@next/bundle-analyzer';

// https://www.npmjs.com/package/@next/bundle-analyzer
const withBundleAnalyzer = initializeBundleAnalyzer({
    enabled: process.env.BUNDLE_ANALYZER_ENABLED === 'true' && !process.env.TURBOPACK
});

// https://nextjs.org/docs/pages/api-reference/next-config-js
const nextConfig: NextConfig = {
    output: 'standalone',
    outputFileTracingIncludes: {
        "/*": ["./registry/**/*"],
      },
      images: {
        remotePatterns: [
          {
            protocol: "https",
            hostname: "avatars.githubusercontent.com",
          },
          {
            protocol: "https",
            hostname: "images.unsplash.com",
          },
        ],
      },
    async rewrites() {
        return [
            {
                source: '/process-transcript',
                destination: 'http://127.0.0.1:8000/process-transcript', // Proxy to your FastAPI backend
            },
            {
                source: '/process-audio',
                destination: 'http://127.0.0.1:8000/process-audio', // Proxy to your FastAPI backend
            },
            {
                source: '/process-document',
                destination: 'http://127.0.0.1:8000/process-document', // Proxy to your FastAPI backend
            },
        ];
    }
};

export default withBundleAnalyzer(nextConfig);
