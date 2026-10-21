import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const nextParam = requestUrl.searchParams.get('next');
  const origin = requestUrl.origin;

  if (code) {
    // 1. Prepare redirect URL base
    let destinationPath = '/stores';

    // 2. Initialize response early so cookies can be written directly to Set-Cookie headers
    // Temporary redirect response object to capture auth session cookies
    let response = NextResponse.redirect(new URL(destinationPath, origin));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

    // 3. Exchange auth code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;

      // 4. Ensure profile and role records exist defensively
      let userRole: string = 'customer';

      try {
        // Query existing user_roles
        const { data: roleRow } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (roleRow?.role) {
          userRole = roleRow.role;
        } else {
          // Check metadata role fallback
          const metaRole = (user.user_metadata?.role as string) || 'customer';
          userRole = metaRole;

          // Check profiles
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

          if (!profile) {
            const fullName =
              (user.user_metadata?.full_name as string) ||
              (user.user_metadata?.name as string) ||
              user.email?.split('@')[0] ||
              '';

            await supabase.from('profiles').insert({
              id: user.id,
              full_name: fullName,
              avatar_path: (user.user_metadata?.avatar_url as string) || null,
            });
          }

          // Insert initial role
          await supabase.from('user_roles').insert({
            user_id: user.id,
            role: userRole,
          });
        }
      } catch (profileErr) {
        console.warn('OAuth callback: profile/role check non-fatal error:', profileErr);
      }

      // 5. Determine target destination based on authenticated role or explicit next parameter
      const isGenericDashboardRequest =
        !nextParam ||
        nextParam === '/dashboard' ||
        nextParam === '/customer-profile' ||
        nextParam === '/rider-dashboard';

      if (!isGenericDashboardRequest && nextParam.startsWith('/')) {
        destinationPath = nextParam;
      } else {
        switch (userRole as string) {
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
            destinationPath = (nextParam === '/dashboard' || nextParam === '/customer-profile') ? '/account' : '/stores';
            break;
        }
      }

      // 6. Handle custom forwarded host in production
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      const redirectBase = isLocalEnv || !forwardedHost ? origin : `https://${forwardedHost}`;
      const finalUrl = new URL(destinationPath, redirectBase);

      // Re-target response to the final URL while preserving the Set-Cookie headers
      const finalResponse = NextResponse.redirect(finalUrl);
      response.cookies.getAll().forEach((cookie) => {
        finalResponse.cookies.set(cookie.name, cookie.value, cookie);
      });

      return finalResponse;
    }
  }

  // Fallback error redirection
  return NextResponse.redirect(new URL('/login?error=oauth_exchange_failed', origin));
}
