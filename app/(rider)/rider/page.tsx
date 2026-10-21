'use client';

import React, { useEffect, useState } from 'react';
import { RiderAvailabilityCard } from '@/components/rider/rider-availability-card';
import { StatCard } from '@/components/dashboard/stat-card';
import { DashboardChart } from '@/components/dashboard/chart';
import { getSalesAccountChartOptions } from '@/lib/dashboard/chart-options';
import { Bike, DollarSign, Award, Clock } from 'lucide-react';
import { useUserSession } from '@/lib/auth/use-user-session';
import { useRoleDashboardData } from '@/lib/dashboard/use-role-dashboard-data';
import { createClient } from '@/lib/supabase/client';

export default function RiderDashboard() {
  const chartOptions = getSalesAccountChartOptions();
  const { user } = useUserSession();
  const { data: roleData } = useRoleDashboardData(user);

  const [completedRuns, setCompletedRuns] = useState<number>(0);
  const [availableJobs, setAvailableJobs] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    async function loadRiderStats() {
      if (!user?.id) return;
      try {
        const supabase = createClient();
        const { data: rider } = await supabase
          .from('riders')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (rider?.id) {
          // Completed runs count
          const { count: compCount } = await supabase
            .from('delivery_assignments')
            .select('id', { count: 'exact', head: true })
            .eq('rider_id', rider.id)
            .eq('status', 'completed');

          if (compCount !== null && isMounted) {
            setCompletedRuns(compCount);
          }

          // Active / Available jobs
          const { count: jobsCount } = await supabase
            .from('delivery_assignments')
            .select('id', { count: 'exact', head: true })
            .eq('rider_id', rider.id)
            .in('status', ['offered', 'accepted']);

          if (jobsCount !== null && isMounted) {
            setAvailableJobs(jobsCount);
          }
        }
      } catch (err) {
        console.warn('RiderDashboard: error loading metrics', err);
      }
    }

    loadRiderStats();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const earnings = roleData?.formattedBalance ?? '₦0.00';
  const jobsCountDisplay = String(availableJobs || (roleData?.badgeCount ?? 0));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Rider Logistics Console
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Monitor your active shift, accept dispatch jobs, and track payout balances.
        </p>
      </div>

      {/* KPI Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Bike}
          label="Available Jobs"
          value={jobsCountDisplay}
          trend={{ value: 'In range', positive: true }}
          caption="Ready for pickup"
        />
        <StatCard
          icon={DollarSign}
          label="Available Earnings"
          value={earnings}
          caption="Per delivery fees"
        />
        <StatCard
          icon={Clock}
          label="Completed Runs"
          value={String(completedRuns)}
          caption="Total completed trips"
        />
        <StatCard
          icon={Award}
          label="On-Time Delivery"
          value="100%"
          trend={{ value: 'Top Tier', positive: true }}
          caption="Abeokuta zone rating"
        />
      </div>

      {/* Availability Status Card */}
      <RiderAvailabilityCard />

      {/* Rider Performance Chart */}
      <DashboardChart
        title="Weekly Deliveries & Payouts"
        subtitle="Completed trips and earned delivery compensations"
        options={chartOptions}
        series={[]}
        emptyText="No delivery trips recorded yet. Go online to begin receiving jobs."
      />
    </div>
  );
}
