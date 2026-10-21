'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import { AuthCard, type AuthSubmitData } from '@/components/auth/auth-card';

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const next = params.get('next') || '';

  async function handleRegister({ email, password, fullName }: AuthSubmitData) {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
        },
      });

      if (error) {
        showToast(error.message, 'error');
        return;
      }

      showToast('Account created — welcome to VigilXpress', 'success');
      // Redirect to the intended destination or default /stores
      router.push(next && next.startsWith('/') ? next : '/stores');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
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
      mode="register"
      onSubmit={handleRegister}
      loading={loading}
      onGoogleSignIn={handleGoogleSignIn}
      googleLoading={googleLoading}
    />
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

