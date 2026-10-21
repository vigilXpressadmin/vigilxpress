'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatKobo } from '@/lib/shared/money';
import type { UserProfileData } from '@/components/layout/user-profile-menu';
import type { UserRole } from '@/components/layout/user-menu-config';

export interface RoleDashboardData {
  walletBalanceKobo: number;
  formattedBalance: string;
  badgeCount: number; // Customer: unread/active orders; Merchant: pending store orders; Rider: active delivery jobs
  lastUpdated: number;
}

const CACHE_TTL_MS = 60 * 1000; // 60 seconds stale-while-revalidate window
const dataCache = new Map<string, RoleDashboardData>();
let globalGenerationId = 0;

/**
 * Clear cache for specific user or all users (e.g. on sign-out)
 */
export function invalidateRoleDashboardData(userId?: string) {
  if (userId) {
    for (const key of dataCache.keys()) {
      if (key.startsWith(`${userId}:`)) {
        dataCache.delete(key);
      }
    }
  } else {
    dataCache.clear();
  }
}

/**
 * Executes a single parallel round of Supabase queries for the given user and role.
 * Never throws, returns safe fallbacks on error.
 */
async function fetchRoleDashboardData(
  userId: string,
  role: UserRole
): Promise<{ walletBalanceKobo: number; badgeCount: number }> {
  const supabase = createClient();
  let walletBalanceKobo = 0;
  let badgeCount = 0;

  try {
    if (role === 'merchant') {
      // 1. Merchant: look up merchant record for this user
      const { data: merchant } = await supabase
        .from('merchants')
        .select('id')
        .eq('owner_id', userId)
        .maybeSingle();

      if (merchant?.id) {
        // Run ledger balance and pending orders query in parallel
        const [ledgerRes, ordersRes] = await Promise.allSettled([
          (async () => {
            const { data: account } = await supabase
              .from('ledger_accounts')
              .select('id')
              .eq('owner_type', 'merchant')
              .eq('owner_id', merchant.id)
              .maybeSingle();

            if (!account?.id) return 0;

            const { data: entries } = await supabase
              .from('ledger_entries')
              .select('amount_kobo, direction')
              .eq('account_id', account.id);

            if (!entries || entries.length === 0) return 0;

            return entries.reduce((acc, entry) => {
              if (entry.direction === 'credit') {
                return acc + (entry.amount_kobo || 0);
              } else if (entry.direction === 'debit') {
                return acc - (entry.amount_kobo || 0);
              }
              return acc;
            }, 0);
          })(),
          supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('merchant_id', merchant.id)
            .in('status', ['merchant_pending', 'paid']),
        ]);

        if (ledgerRes.status === 'fulfilled') {
          walletBalanceKobo = Math.max(0, ledgerRes.value);
        }
        if (ordersRes.status === 'fulfilled' && ordersRes.value.count !== null) {
          badgeCount = ordersRes.value.count || 0;
        }
      }
    } else if (role === 'rider') {
      // 2. Rider: look up rider record for this user
      const { data: rider } = await supabase
        .from('riders')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (rider?.id) {
        // Run ledger balance and active jobs query in parallel
        const [ledgerRes, jobsRes] = await Promise.allSettled([
          (async () => {
            const { data: account } = await supabase
              .from('ledger_accounts')
              .select('id')
              .eq('owner_type', 'rider')
              .eq('owner_id', rider.id)
              .maybeSingle();

            if (!account?.id) return 0;

            const { data: entries } = await supabase
              .from('ledger_entries')
              .select('amount_kobo, direction')
              .eq('account_id', account.id);

            if (!entries || entries.length === 0) return 0;

            return entries.reduce((acc, entry) => {
              if (entry.direction === 'credit') {
                return acc + (entry.amount_kobo || 0);
              } else if (entry.direction === 'debit') {
                return acc - (entry.amount_kobo || 0);
              }
              return acc;
            }, 0);
          })(),
          supabase
            .from('delivery_assignments')
            .select('id', { count: 'exact', head: true })
            .eq('rider_id', rider.id)
            .in('status', ['offered', 'accepted']),
        ]);

        if (ledgerRes.status === 'fulfilled') {
          walletBalanceKobo = Math.max(0, ledgerRes.value);
        }
        if (jobsRes.status === 'fulfilled' && jobsRes.value.count !== null) {
          badgeCount = jobsRes.value.count || 0;
        }
      }
    } else {
      // 3. Customer (default): ledger balance if customer wallet exists + pending/active orders
      const [ledgerRes, ordersRes] = await Promise.allSettled([
        (async () => {
          const { data: account } = await supabase
            .from('ledger_accounts')
            .select('id')
            .eq('owner_type', 'customer')
            .eq('owner_id', userId)
            .maybeSingle();

          if (!account?.id) return 0;

          const { data: entries } = await supabase
            .from('ledger_entries')
            .select('amount_kobo, direction')
            .eq('account_id', account.id);

          if (!entries || entries.length === 0) return 0;

          return entries.reduce((acc, entry) => {
            if (entry.direction === 'credit') {
              return acc + (entry.amount_kobo || 0);
            } else if (entry.direction === 'debit') {
              return acc - (entry.amount_kobo || 0);
            }
            return acc;
          }, 0);
        })(),
        supabase
          .from('order_groups')
          .select('id', { count: 'exact', head: true })
          .eq('customer_id', userId)
          .in('status', ['payment_pending', 'paid']),
      ]);

      if (ledgerRes.status === 'fulfilled') {
        walletBalanceKobo = Math.max(0, ledgerRes.value);
      }
      if (ordersRes.status === 'fulfilled' && ordersRes.value.count !== null) {
        badgeCount = ordersRes.value.count || 0;
      }
    }
  } catch (err) {
    console.warn('fetchRoleDashboardData: resilient error fallback', err);
  }

  return { walletBalanceKobo, badgeCount };
}

export interface UseRoleDashboardDataReturn {
  data: RoleDashboardData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Shared hook to load live wallet balance and menu badge count for the active role.
 *
 * Performance and Reliability guarantees:
 * - Lazy fetching: Only executes when user is signed in (user !== null).
 * - Stale-while-revalidate: Returns cached values immediately on mount or page navigation.
 * - Race-condition safe: Generation ID prevents stale responses from older sessions/roles.
 * - Error resilient: Never throws or breaks layout if network/database is unavailable.
 */
export function useRoleDashboardData(
  user: UserProfileData | null,
  options: { enabled?: boolean } = { enabled: true }
): UseRoleDashboardDataReturn {
  const userId = user?.id;
  const role = user?.role || 'customer';
  const cacheKey = userId ? `${userId}:${role}` : null;

  // Initialize with cached data if available (zero layout shift)
  const [data, setData] = useState<RoleDashboardData | null>(() => {
    if (!cacheKey) return null;
    return dataCache.get(cacheKey) || null;
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (!cacheKey) return false;
    const existing = dataCache.get(cacheKey);
    return !existing;
  });
  const [error, setError] = useState<Error | null>(null);

  const currentGenRef = useRef(0);

  const fetchData = useCallback(
    async (force = false) => {
      if (!userId || !cacheKey || options.enabled === false) {
        setData(null);
        setLoading(false);
        return;
      }

      const now = Date.now();
      const cached = dataCache.get(cacheKey);

      // If fresh cached data exists and not forced, return immediately
      if (cached && !force && now - cached.lastUpdated < CACHE_TTL_MS) {
        setData(cached);
        setLoading(false);
        return;
      }

      // If stale cache exists, display it while revalidating
      if (cached) {
        setData(cached);
      } else {
        setLoading(true);
      }

      const genId = ++globalGenerationId;
      currentGenRef.current = genId;

      try {
        const { walletBalanceKobo, badgeCount } = await fetchRoleDashboardData(
          userId,
          role
        );

        // Discard if newer request or user changed
        if (currentGenRef.current !== genId) return;

        const newData: RoleDashboardData = {
          walletBalanceKobo,
          formattedBalance: formatKobo(walletBalanceKobo),
          badgeCount,
          lastUpdated: Date.now(),
        };

        dataCache.set(cacheKey, newData);
        setData(newData);
        setError(null);
      } catch (err: unknown) {
        if (currentGenRef.current !== genId) return;
        const e = err instanceof Error ? err : new Error('Failed to load dashboard data');
        setError(e);
        // Resilient fallback: preserve existing or default to 0
        if (!dataCache.has(cacheKey)) {
          const fallbackData: RoleDashboardData = {
            walletBalanceKobo: 0,
            formattedBalance: formatKobo(0),
            badgeCount: 0,
            lastUpdated: Date.now(),
          };
          setData(fallbackData);
        }
      } finally {
        if (currentGenRef.current === genId) {
          setLoading(false);
        }
      }
    },
    [userId, role, cacheKey, options.enabled]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData(true);
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}
