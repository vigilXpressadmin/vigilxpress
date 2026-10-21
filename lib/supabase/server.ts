import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getSupabaseBrowserCredentials } from './env';

export async function createClient() {
  const creds = getSupabaseBrowserCredentials({ throwOnMissing: true });
  const cookieStore = await cookies();
  return createServerClient(creds!.url, creds!.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {}
      }
    }
  });
}