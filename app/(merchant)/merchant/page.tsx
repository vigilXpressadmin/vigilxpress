'use client';

import React, { useEffect, useState } from 'react';
import { MerchantOrderBoard } from '@/components/merchant/merchant-order-board';
import { StatCard } from '@/components/dashboard/stat-card';
import { DashboardChart } from '@/components/dashboard/chart';
import { getSalesAccountChartOptions } from '@/lib/dashboard/chart-options';
import { ShoppingBag, UtensilsCrossed, Wallet, Star } from 'lucide-react';
import { useUserSession } from '@/lib/auth/use-user-session';
import { useRoleDashboardData } from '@/lib/dashboard/use-role-dashboard-data';
import { createClient } from '@/lib/supabase/client';

export default function MerchantDashboard() {
  const chartOptions = getSalesAccountChartOptions();
  const { user } = useUserSession();
  const { data: roleData } = useRoleDashboardData(user);
  const [menuItemsCount, setMenuItemsCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    async function loadMerchantStats() {
      if (!user?.id) return;
      try {
        const supabase = createClient();
        const { data: merchant } = await supabase
          .from('merchants')
          .select('id')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (merchant?.id) {
          const { count } = await supabase
            .from('products')
            .select('id', { count: 'exact', head: true })
            .eq('merchant_id', merchant.id);

          if (count !== null && isMounted) {
            setMenuItemsCount(count);
          }
        }
      } catch (err) {
        console.warn('MerchantDashboard: error loading products count', err);
      }
    }

    loadMerchantStats();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const availableBalance = roleData?.formattedBalance ?? '₦0.00';
  const pendingOrders = String(roleData?.badgeCount ?? 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Merchant Operations
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Manage products, availability, orders and wallet visibility for your own store only.
        </p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ShoppingBag}
          label="Pending Orders"
          value={pendingOrders}
          trend={{ value: 'Real-time queue', positive: true }}
          caption="Awaiting confirmation"
        />
        <StatCard
          icon={UtensilsCrossed}
          label="Active Menu Items"
          value={String(menuItemsCount)}
          caption="Synced to catalogue"
        />
        <StatCard
          icon={Wallet}
          label="Available Balance"
          value={availableBalance}
          caption="Cleared ledger"
        />
        <StatCard
          icon={Star}
          label="Store Rating"
          value="5.0 ★"
          trend={{ value: 'Verified', positive: true }}
          caption="From customer orders"
        />
      </div>

      {/* Live Order Queue */}
      <MerchantOrderBoard />

      {/* Sales Account Chart (empty series with visible No Data Yet state) */}
      <DashboardChart
        title="Revenue & Order Volume"
        subtitle="Department-wise daily settled sales"
        options={chartOptions}
        series={[]}
        emptyText="No sales history recorded yet for this merchant store."
      />
    </div>
  );
}
