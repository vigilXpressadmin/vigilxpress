/**
 * Pre-build environment verification script for VigilXpress.
 *
 * Verifies that essential build-time environment variables are configured.
 * If variables are missing, this script exits with code 1 and outputs
 * clear, actionable instructions for configuring Vercel and local environments.
 */

import nextEnv from '@next/env';

const { loadEnvConfig } = nextEnv;
// Load .env, .env.local, etc. locally just as Next.js does
loadEnvConfig(process.cwd());

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = (
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)?.trim();

const missing = [];
if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL');
if (!key) missing.push('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)');

if (missing.length > 0) {
  const errorMessage = `
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

For local builds:
  Ensure .env.local exists in your project root with valid Supabase credentials.
================================================================================
`.trim();

  console.error('\n' + errorMessage + '\n');
  process.exit(1);
}

console.log('✓ Pre-build environment verification passed: Supabase credentials detected.');
