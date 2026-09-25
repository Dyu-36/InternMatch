import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
  },
};

if (process.env.VERCEL && (!process.env.NEXT_PUBLIC_INTERNMATCH_SUPABASE_URL || !process.env.NEXT_PUBLIC_INTERNMATCH_SUPABASE_PUBLISHABLE_KEY)) {
  throw new Error('InternMatch Supabase environment is not configured.');
}

export default nextConfig;
