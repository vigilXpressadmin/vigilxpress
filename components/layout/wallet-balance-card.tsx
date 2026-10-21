'use client';

import React from 'react';
import Link from 'next/link';
import { Wallet, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WalletBalanceCardProps {
  formattedBalance?: string | null;
  loading?: boolean;
  error?: Error | null;
  walletHref?: string;
  className?: string;
}

/**
 * Live wallet balance display card inside UserProfileMenu.
 * - Glassmorphism card matching navbar design system tokens.
 * - Loading state: GPU-accelerated opacity shimmer sized exactly like loaded text (zero layout shift).
 * - Error state: Silently displays "—" without crashing or disrupting the menu.
 * - Accessible and isolated via React.memo.
 */
export const WalletBalanceCard = React.memo(function WalletBalanceCard({
  formattedBalance,
  loading = false,
  error = null,
  walletHref,
  className,
}: WalletBalanceCardProps) {
  // Silent error fallback: show "—"
  const displayValue = error ? '—' : formattedBalance || '₦0.00';

  return (
    <div
      className={cn(
        'mx-1 my-1.5 p-2.5 rounded-xl flex items-center justify-between gap-3',
        'bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10',
        'backdrop-blur-sm shadow-sm transition-all duration-150',
        className
      )}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 grid place-items-center shrink-0">
          <Wallet size={16} />
        </div>
        <div className="min-w-0 flex flex-col text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 leading-none">
            Wallet Balance
          </span>
          <div className="mt-1 h-[18px] flex items-center">
            {loading && !formattedBalance ? (
              // Skeleton shimmer matching exact text dimensions for zero layout shift
              <span
                aria-label="Loading wallet balance"
                className="inline-block w-20 h-3.5 rounded bg-black/10 dark:bg-white/15 nav-skeleton"
              />
            ) : (
              <span className="text-xs font-black tracking-tight text-ink dark:text-white leading-none truncate">
                {displayValue}
              </span>
            )}
          </div>
        </div>
      </div>

      {walletHref && (
        <Link
          href={walletHref}
          className="flex items-center gap-1 text-[11px] font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 no-underline px-2 py-1 rounded-lg hover:bg-brand-500/10 transition-colors shrink-0"
          aria-label="View wallet details"
        >
          <span>View</span>
          <ArrowRight size={12} />
        </Link>
      )}
    </div>
  );
});
