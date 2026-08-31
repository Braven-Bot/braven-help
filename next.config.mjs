import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Standalone bundles the server and only the node_modules it actually uses,
  // which is what keeps the runtime image small. The Dockerfile copies
  // .next/standalone and expects server.js to be there.
  output: 'standalone',
};

export default withMDX(config);
