'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import type { UserProfileData } from '@/components/layout/user-profile-menu';
import type { UserRole } from '@/components/layout/user-menu-config';
import { invalidateRoleDashboardData } from '@/lib/dashboard/use-role-dashboard-data';
import type { Session } from '@supabase/supabase-js';

type ActiveSupabaseClient = NonNullable<ReturnType<typeof createClient>>;

interface AuthContextValue {
  user: UserProfileData | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function resolveUserProfile(
  supabase: ActiveSupabaseClient,
  authUser: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  }
): Promise<UserProfileData> {
  const metadata = authUser.user_metadata || {};
  let role: UserRole = (metadata.role as UserRole) || 'customer';
  let fullName =
    (metadata.full_name as string) ||
    (metadata.name as string) ||
    '';
  let avatarUrl = (metadata.avatar_url as string) || undefined;

  try {
    // Check authoritative user_roles table
    const { data: roleRow } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (roleRow?.role) {
      role = roleRow.role as UserRole;
    }

    // Check public.profiles for full_name and avatar_path
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_path')
      .eq('id', authUser.id)
      .maybeSingle();

    if (profile) {
      if (profile.full_name) fullName = profile.full_name;
      if (profile.avatar_path) avatarUrl = profile.avatar_path;
    }
  } catch (err) {
    console.warn('resolveUserProfile: fallback to user metadata', err);
  }

  const name = fullName.trim() || authUser.email?.split('@')[0] || 'User';

  return {
    id: authUser.id,
    name,
    email: authUser.email || '',
    role,
    avatarUrl,
    online: true,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Server render and initial client hydration start with identical state (loading: true)
  // to avoid hydration mismatch and prevent flashes of logged-out UI.
  const [user, setUser] = useState<UserProfileData | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast } = useToast();

  const refreshUser = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setSession(null);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error || !currentSession?.user) {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      setSession(currentSession);
      const profile = await resolveUserProfile(supabase, currentSession.user);
      setUser(profile);
    } catch (err) {
      console.warn('AuthProvider: refreshUser error', err);
      setSession(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial session hydration and listener setup executed exclusively on the client
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    // 1. Initial hydration from persistent session
    supabase.auth.getSession().then(async ({ data: { session: initSession }, error }) => {
      if (!isMounted) return;
      if (error || !initSession?.user) {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      setSession(initSession);
      const profile = await resolveUserProfile(supabase, initSession.user);
      if (isMounted) {
        setUser(profile);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    // 2. Real-time auth state subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      if (!newSession?.user || event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setLoading(false);
        return;
      }

      setSession(newSession);
      const profile = await resolveUserProfile(supabase, newSession.user);
      if (isMounted) {
        setUser(profile);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async (): Promise<boolean> => {
    const supabase = createClient();
    if (!supabase) {
      setUser(null);
      setSession(null);
      return true;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        showToast(error.message || 'Error signing out', 'error');
        return false;
      }

      setUser(null);
      setSession(null);
      invalidateRoleDashboardData();
      showToast('Signed out successfully', 'info');
      router.push('/login');
      router.refresh();
      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error signing out';
      showToast(msg, 'error');
      return false;
    }
  }, [router, showToast]);

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return ctx;
}
