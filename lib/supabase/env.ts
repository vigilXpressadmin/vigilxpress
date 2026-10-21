/**
 * VigilXpress Supabase Environment Configuration Helper
 *
 * CRITICAL RULE: Next.js only inlines NEXT_PUBLIC_* variables into client bundles
 * when they are referenced literally (e.g. process.env.NEXT_PUBLIC_SUPABASE_URL).
 * NEVER use dynamic access like process.env[name]!
 */

export interface SupabaseClientCredentials {
  url: string;
  anonKey: string;
}

export function formatMissingSupabaseEnvError(): string {
  return `
================================================================================
[VigilXpress Configuration Error] Missing Supabase Environment Variables
================================================================================
Your project's Supabase URL and API Key are required for this deployment.

Required variables:
  1. NEXT_PUBLIC_SUPABASE_URL
  2. NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)

How to resolve in Vercel:
  1. Go to your Vercel Dashboard -> Project Settings -> Environment Variables.
  2. Add NEXT_PUBLIC_SUPABASE_URL (e.g. https://your-project.supabase.co).
  3. Add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).
  4. Enable them for all applicable environments: Production, Preview, Development.
  5. Redeploy your project (NEXT_PUBLIC_* variables are inlined at build time).

Local development:
  Copy .env.example to .env.local and fill in your Supabase project credentials.
================================================================================
`.trim();
}

/**
 * Returns trimmed Supabase credentials or throws/returns null based on options.
 *
 * Preference order for public key:
 *   1. process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (modern Supabase naming)
 *   2. process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY (classic Supabase naming)
 */
export function getSupabaseBrowserCredentials(options?: {
  throwOnMissing?: boolean;
}): SupabaseClientCredentials | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )?.trim();

  const isComplete = Boolean(url && anonKey && url.length > 0 && anonKey.length > 0);

  if (!isComplete) {
    if (options?.throwOnMissing) {
      throw new Error(formatMissingSupabaseEnvError());
    }
    return null;
  }

  return {
    url: url as string,
    anonKey: anonKey as string,
  };
}
