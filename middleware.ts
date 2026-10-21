import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseBrowserCredentials } from '@/lib/supabase/env';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const path = request.nextUrl.pathname;
  const isProtectedPath =
    path.startsWith('/merchant') ||
    path.startsWith('/rider') ||
    path.startsWith('/admin') ||
    path.startsWith('/account') ||
    path === '/dashboard' ||
    path === '/customer-profile' ||
    path === '/rider-dashboard' ||
    path === '/checkout';

  // Obtain Supabase credentials safely without throwing
  const creds = getSupabaseBrowserCredentials({ throwOnMissing: false });

  if (!creds) {
    // Fail closed for protected routes: never allow access if credentials are missing
    if (isProtectedPath) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', path);
      return NextResponse.redirect(url);
    }
    // Public marketing and browsing routes continue
    return response;
  }

  const supabase = createServerClient(
    creds.url,
    creds.anonKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) => {
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', path);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/health).*)']
};