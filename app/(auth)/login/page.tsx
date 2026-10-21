'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import { AuthCard, type AuthSubmitData } from '@/components/auth/auth-card';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const next = params.get('next') || '';

  async function handleLogin({ email, password }: AuthSubmitData) {
    const supabase = createClient();
    if (!supabase) {
      showToast('Authentication service is not configured.', 'error');
      return;
    }
    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        showToast(error.message, 'error');
        return;
      }
      showToast('Welcome back!', 'success');

      if (next && next !== '/dashboard' && next !== '/customer-profile' && next !== '/rider-dashboard') {
        router.push(next);
      } else {
        // Resolve user role
        const userId = authData.user?.id;
        let userRole = 'customer';
        if (userId) {
          const { data: roleRow } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .maybeSingle();
          if (roleRow?.role) {
            userRole = roleRow.role;
          } else if (authData.user?.user_metadata?.role) {
            userRole = authData.user.user_metadata.role as string;
          }
        }

        switch (userRole) {
          case 'merchant':
            router.push('/merchant');
            break;
          case 'rider':
            router.push('/rider');
            break;
          case 'admin':
            router.push('/admin');
            break;
          case 'customer':
          default:
            router.push((next === '/dashboard' || next === '/customer-profile') ? '/account' : '/stores');
            break;
        }
      }
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign in failed';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    const supabase = createClient();
    if (!supabase) {
      showToast('Authentication service is not configured.', 'error');
      return;
    }
    setGoogleLoading(true);
    try {
      const callbackUrl = `${window.location.origin}/auth/callback${
        next ? `?next=${encodeURIComponent(next)}` : ''
      }`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: callbackUrl },
      });
      if (error) {
        showToast(error.message, 'error');
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      showToast(msg, 'error');
      setGoogleLoading(false);
    }
  }

  return (
    <AuthCard
      mode="login"
      onSubmit={handleLogin}
      loading={loading}
      onGoogleSignIn={handleGoogleSignIn}
      googleLoading={googleLoading}
    />
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}