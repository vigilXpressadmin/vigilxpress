'use client';

import React from 'react';
import { Wallet, CheckCircle2, TrendingUp, AlertCircle, Clock } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { ActivityFeed, type ActivityItem } from '@/components/dashboard/activity-feed';
import { formatKobo } from '@/lib/shared/money';
import { useUserSession } from '@/lib/auth/use-user-session';
import { useRoleDashboardData } from '@/lib/dashboard/use-role-dashboard-data';

export default function RiderEarningsPage() {
  const earningsActivity: ActivityItem[] = [];
  const { user } = useUserSession();
  const { data: roleData } = useRoleDashboardData(user);

  const availableBalance = roleData?.formattedBalance ?? formatKobo(0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Earnings & Payouts
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Track completed delivery trip payouts, customer tips, and cleared ledger balances.
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="Available Balance"
          value={availableBalance}
          caption="Cleared for settlement"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed Trips"
          value="0"
          caption="Verified PIN dropoffs"
        />
        <StatCard
          icon={TrendingUp}
          label="Tips & Bonuses"
          value={formatKobo(0)}
          caption="100% rider kept"
        />
        <StatCard
          icon={Clock}
          label="Pending Trips"
          value="0"
          caption="In-transit deliveries"
        />
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs">
        <AlertCircle size={16} className="text-amber-600 flex-none mt-0.5" />
        <p>
          Rider earnings are credited into internal ledger accounts upon delivery PIN validation.
          Bank payout disbursements require administrative settlement clearance.
        </p>
      </div>

      {/* Activity Feed */}
      <div className="max-w-2xl">
        <ActivityFeed
          title="Recent Trip & Payout Activity"
          items={earningsActivity}
          emptyMessage="No payout or delivery earnings activity recorded yet."
        />
      </div>
    </div>
  );
}
