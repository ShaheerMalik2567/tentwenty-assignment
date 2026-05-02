import type { NextConfig } from "next";

/**
 * On Vercel, `VERCEL_URL` is set per deployment (preview + production).
 * NextAuth needs a canonical `NEXTAUTH_URL`; if you omit it in the dashboard,
 * derive it here so preview deployments work without manual env per branch.
 */
const nextAuthUrl =
  process.env.NEXTAUTH_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

const nextConfig: NextConfig = {
  ...(nextAuthUrl ? { env: { NEXTAUTH_URL: nextAuthUrl } } : {}),
};

export default nextConfig;
