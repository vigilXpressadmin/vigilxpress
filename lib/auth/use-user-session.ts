'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import type { UserProfileData } from '@/components/layout/user-profile-menu';
import type { UserRole } from '@/components/layout/user-menu-config';
import { invalidateRoleDashboardData } from '@/lib/dashboard/use-role-dashboard-data';

// Module-level cache so navigating between pages causes ZERO duplicate network requests
let cachedUser: UserProfileData | null = null;
let hasInitialLoaded = false;
const listeners = new Set<(user: UserProfileData | null) => void>();

function notifyListeners(user: UserProfileData | null) {
  cachedUser = user;
  listeners.forEach((listener) => listener(user));
}

/**
 * Extracts normalized UserProfileData from Supabase User and database profile
 */
async function buildUserProfile(supabase: NonNullable<ReturnType<typeof createClient>>, authUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}): Promise<UserProfileData> {
  const metadata = authUser.user_metadata || {};
  let role: UserRole = (metadata.role as UserRole) || 'customer';
  let fullName =
    (metadata.full_name as string) ||
    (metadata.name as string) ||
    '';
  let avatarUrl = (metadata.avatar_url as string) || undefined;

  try {
    // 1. Check user_roles table first (authoritative role mapping)
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authUser.id)
      .maybeSingle();

    if (roleData?.role) {
      role = roleData.role as UserRole;
    }

    // 2. Check public.profiles for full_name and avatar_path
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
    // Silently proceed with metadata fallbacks if profile lookup encounters an issue
    console.warn('buildUserProfile: profile lookup fallback to metadata', err);
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

export interface UseUserSessionReturn {
  user: UserProfileData | null;
  loading: boolean;
  signOut: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

/**
 * Shared live authentication hook for FloatingNavbar, ProfileDropdown, and Page Views.
 * - Reuses existing createClient() from @/lib/supabase/client
 * - Reuses existing useToast() from @/components/ui/toast
 * - In-memory module caching across client navigations
 * - Real-time onAuthStateChange subscription
 * - Safe error resilience (never throws, never crashes layout)
 */
export function useUserSession(): UseUserSessionReturn {
  const [user, setUser] = useState<UserProfileData | null>(cachedUser);
  const [loading, setLoading] = useState<boolean>(!hasInitialLoaded);
  const router = useRouter();
  const { showToast } = useToast();
  const mountedRef = useRef(true);

  // Sync with module listener set
  useEffect(() => {
    mountedRef.current = true;
    const handleUpdate = (nextUser: UserProfileData | null) => {
      if (mountedRef.current) {
        setUser(nextUser);
        setLoading(false);
      }
    };

    listeners.add(handleUpdate);
    return () => {
      mountedRef.current = false;
      listeners.delete(handleUpdate);
    };
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const supabase = createClient();
      if (!supabase) {
        hasInitialLoaded = true;
        notifyListeners(null);
        return;
      }
      // 1. Immediately check locally persisted session (instant zero-delay rehydration on refresh)
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        hasInitialLoaded = true;
        notifyListeners(null);
        return;
      }

      const profile = await buildUserProfile(supabase, session.user);
      hasInitialLoaded = true;
      notifyListeners(profile);
    } catch (err) {
      console.warn('useUserSession: error fetching auth user', err);
      hasInitialLoaded = true;
      notifyListeners(null);
    }
  }, []);

  // Initialize and subscribe
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) {
      setLoading(false);
      return;
    }

    const failsafeTimeout = setTimeout(() => {
      hasInitialLoaded = true;
      if (mountedRef.current) {
        setLoading(false);
      }
    }, 3000);

    if (!hasInitialLoaded) {
      refreshUser();
    }

    // Subscribe to live auth events (SIGN_IN, SIGN_OUT, TOKEN_REFRESHED)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      clearTimeout(failsafeTimeout);
      if (!session?.user || event === 'SIGNED_OUT') {
        hasInitialLoaded = true;
        notifyListeners(null);
        invalidateRoleDashboardData();
        return;
      }

      // Live update user profile on sign in or token refresh
      const profile = await buildUserProfile(supabase, session.user);
      hasInitialLoaded = true;
      notifyListeners(profile);
    });

    return () => {
      clearTimeout(failsafeTimeout);
      subscription.unsubscribe();
    };
  }, [refreshUser]);

  const signOut = useCallback(async (): Promise<boolean> => {
    try {
      const supabase = createClient();
      if (!supabase) return true;
      const { error } = await supabase.auth.signOut();
      if (error) {
        showToast(error.message || 'Error signing out', 'error');
        return false;
      }

      // Revert state and clear caches immediately
      hasInitialLoaded = true;
      notifyListeners(null);
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

  return {
    user,
    loading,
    signOut,
    refreshUser,
  };
}
