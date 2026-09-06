import type { NextConfig } from 'next';

const config: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default config;
