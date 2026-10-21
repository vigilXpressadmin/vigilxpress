// Build-time verification: check for essential Supabase variables if running a production build
const isBuild = process.argv.includes('build') || process.env.NEXT_PHASE === 'phase-production-build';
if (isBuild) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  if (!url || !key) {
    const missing = [];
    if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!key) missing.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');

    console.error(`
================================================================================
[VigilXpress Configuration Error] Missing Supabase Environment Variables!
================================================================================
The production build cannot continue because required public configuration
is missing from the environment:

Missing variable(s):
${missing.map((v) => `  - ${v}`).join('\n')}

Action required to fix this build:
  1. Open your Vercel Project Dashboard:
     https://vercel.com/dashboard -> Select Project -> Settings -> Environment Variables
  2. Add the missing variable(s):
     - NEXT_PUBLIC_SUPABASE_URL: Your Supabase Project URL (https://xxxx.supabase.co)
     - NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY): Your public API key
  3. Ensure the variables are assigned to the target environment(s):
     [x] Production  [x] Preview  [x] Development
  4. Trigger a new deployment (NEXT_PUBLIC_* variables must be present during build time).
================================================================================
`.trim());
    process.exit(1);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // eslint-config-next 15 + ESLint 9 "Failed to patch ESLint" workaround.
    // Type checking still runs during builds. Run lint separately when needed.
    ignoreDuringBuilds: true
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' }
        ]
      }
    ];
  }
};

export default nextConfig;