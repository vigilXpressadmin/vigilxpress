'use client';

import { createBrowserClient } from '@supabase/ssr';
import { getSupabaseBrowserCredentials } from './env';

export type SupabaseBrowserClient = ReturnType<typeof createBrowserClient>;

let browserClient: SupabaseBrowserClient | undefined;

/**
 * Singleton Supabase browser client to prevent lock collisions,
 * maintain persistent authentication state across re-renders/page refreshes,
 * and synchronize auth events reliably.
 *
 * Server-safe behavior:
 * When invoked on the server during build-time static page prerendering and
 * credentials are not present, this function returns null rather than creating
 * a fake stub or crashing the build.
 * On the client, missing credentials throw an actionable configuration error.
 */
export function createClient(): SupabaseBrowserClient {
  const creds = getSupabaseBrowserCredentials({ throwOnMissing: false });

  if (!creds) {
    if (typeof window === 'undefined') {
      // Return null on the server during prerender when credentials are missing (no fake stub)
      return null as unknown as SupabaseBrowserClient;
    }
    // On the client, throw an actionable error pointing to Vercel/environment configuration
    getSupabaseBrowserCredentials({ throwOnMissing: true });
    return null as unknown as SupabaseBrowserClient;
  }

  if (typeof window === 'undefined') {
    return createBrowserClient(creds.url, creds.anonKey);
  }

  if (!browserClient) {
    browserClient = createBrowserClient(creds.url, creds.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}
