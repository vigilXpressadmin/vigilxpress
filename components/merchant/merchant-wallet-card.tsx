'use client';

import React from 'react';
import { formatKobo } from '@/lib/shared/money';
import { Wallet, Clock, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useToast } from '@/components/ui/toast';

import { useUserSession } from '@/lib/auth/use-user-session';
import { useRoleDashboardData } from '@/lib/dashboard/use-role-dashboard-data';

export function MerchantWalletCard({
  availableKobo,
  pendingKobo,
  lifetimeSalesKobo,
}: {
  availableKobo?: number;
  pendingKobo?: number;
  lifetimeSalesKobo?: number;
}) {
  const { showToast } = useToast();
  const { user } = useUserSession();
  const { data: roleData } = useRoleDashboardData(user);

  const effectiveAvailableKobo = availableKobo ?? roleData?.walletBalanceKobo ?? 0;
  const effectivePendingKobo = pendingKobo ?? 0;
  const effectiveLifetimeSalesKobo = lifetimeSalesKobo ?? 0;

  const handleWithdrawAttempt = () => {
    showToast(
      'Bank payout is disabled until settlement rules and provider capabilities are verified.',
      'warning'
    );
  };

  return (
    <div className="card p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-line">
        <div>
          <h2 className="text-lg font-bold text-ink">Store Settlement & Wallet</h2>
          <p className="text-xs text-neutral-500">
            Internal ledger accounting of settled and in-transit revenues
          </p>
        </div>

        <button
          type="button"
          onClick={handleWithdrawAttempt}
          className="btn-primary !py-2 !px-4 text-xs flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Request Payout</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-soft/50 p-5 transition-all hover:bg-white hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="w-8 h-8 rounded-lg bg-green-500/10 text-ok grid place-items-center">
              <Wallet size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-ink">
            {formatKobo(effectiveAvailableKobo)}
          </p>
          <span className="text-[11px] text-ok font-medium mt-1 inline-block">
            Cleared for settlement
          </span>
        </div>

        <div className="rounded-2xl border border-line bg-soft/50 p-5 transition-all hover:bg-white hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Pending Orders
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 grid place-items-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-ink">
            {formatKobo(effectivePendingKobo)}
          </p>
          <span className="text-[11px] text-amber-700 font-medium mt-1 inline-block">
            Awaiting order completion
          </span>
        </div>

        <div className="rounded-2xl border border-line bg-soft/50 p-5 transition-all hover:bg-white hover:shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Lifetime Sales
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 grid place-items-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="mt-2 text-2xl font-extrabold text-ink">
            {formatKobo(effectiveLifetimeSalesKobo)}
          </p>
          <span className="text-[11px] text-neutral-500 font-medium mt-1 inline-block">
            Total gross volume
          </span>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs">
        <AlertCircle size={16} className="text-amber-600 flex-none mt-0.5" />
        <p>
          Wallet credit is internal accounting. Bank payout is disabled until settlement rules and provider capabilities are verified.
        </p>
      </div>
    </div>
  );
}
