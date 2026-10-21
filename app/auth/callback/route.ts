import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { getSupabaseBrowserCredentials } from '@/lib/supabase/env';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextParam = requestUrl.searchParams.get('next');
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';
  const origin = isLocalEnv || !forwardedHost ? requestUrl.origin : `https://${forwardedHost}`;

  if (code) {
    const creds = getSupabaseBrowserCredentials({ throwOnMissing: true });
    let destinationPath = '/stores';
    const response = NextResponse.redirect(new URL(destinationPath, origin));

    const supabase = createServerClient(
      creds!.url,
      creds!.anonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // 1. Exchange auth code for persistent session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;
      let userRole: string = 'customer';

      // 2. Resolve profile and role
      try {
        const { data: roleRow } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (roleRow?.role) {
          userRole = roleRow.role;
        } else {
          userRole = (user.user_metadata?.role as string) || 'customer';

          const fullName =
            (user.user_metadata?.full_name as string) ||
            (user.user_metadata?.name as string) ||
            user.email?.split('@')[0] ||
            '';

          await supabase.from('profiles').upsert({
            id: user.id,
            full_name: fullName,
            avatar_path: (user.user_metadata?.avatar_url as string) || null,
          });

          await supabase.from('user_roles').upsert({
            user_id: user.id,
            role: userRole,
          });
        }
      } catch (profileErr) {
        console.warn('OAuth callback profile resolution non-fatal warning:', profileErr);
      }

      // 3. Determine redirect target based on explicit nextParam or resolved role
      const isGenericDashboardRequest =
        !nextParam ||
        nextParam === '/dashboard' ||
        nextParam === '/customer-profile' ||
        nextParam === '/rider-dashboard';

      if (!isGenericDashboardRequest && nextParam.startsWith('/')) {
        destinationPath = nextParam;
      } else {
        switch (userRole) {
          case 'merchant':
            destinationPath = '/merchant';
            break;
          case 'rider':
            destinationPath = '/rider';
            break;
          case 'admin':
            destinationPath = '/admin';
            break;
          case 'customer':
          default:
            destinationPath =
              nextParam === '/dashboard' || nextParam === '/customer-profile'
                ? '/account'
                : '/stores';
            break;
        }
      }

      const finalUrl = new URL(destinationPath, origin);
      // Update Location header directly so all session cookies attached to response are preserved
      response.headers.set('Location', finalUrl.toString());
      return response;
    }
  }

  // Fallback error redirection
  return NextResponse.redirect(new URL('/login?error=oauth_exchange_failed', origin));
}
