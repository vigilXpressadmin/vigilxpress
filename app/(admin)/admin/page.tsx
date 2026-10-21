'use client';

import React from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/dashboard/stat-card';
import { ActivityFeed, type ActivityItem } from '@/components/dashboard/activity-feed';
import { DashboardChart } from '@/components/dashboard/chart';
import { getSalesAccountChartOptions } from '@/lib/dashboard/chart-options';
import {
  Store,
  Bike,
  ShoppingBag,
  DollarSign,
  ArrowRight,
  MapPin,
  CreditCard,
  UserCheck,
} from 'lucide-react';

const RECENT_AUDIT_LOGS: ActivityItem[] = [
  {
    id: 'log-1',
    icon: Store,
    title: 'Merchant onboarding queue updated',
    time: '12m ago',
    description: 'New store profile submitted for Ibara central service area.',
    badge: { label: 'Pending Review', variant: 'warning' },
  },
  {
    id: 'log-2',
    icon: Bike,
    title: 'Rider document verification',
    time: '1h ago',
    description: 'Driver license and bike inspection submitted for Abeokuta zone.',
    badge: { label: 'Awaiting Verification', variant: 'neutral' },
  },
  {
    id: 'log-3',
    icon: CreditCard,
    title: 'Paystack reconciliation sync',
    time: '2h ago',
    description: 'Automated webhook audit completed with zero idempotency discrepancies.',
    badge: { label: 'Reconciled', variant: 'success' },
  },
];

export default function AdminDashboard() {
  const chartOptions = getSalesAccountChartOptions();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Admin Operations & Governance
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Platform-wide controls, merchant and rider approvals, service zones, and financial audit logs.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Store}
          label="Registered Stores"
          value="1"
          trend={{ value: 'Active', positive: true }}
          caption="In Abeokuta cluster"
        />
        <StatCard
          icon={Bike}
          label="Active Riders"
          value="1"
          trend={{ value: 'Fleet Ready', positive: true }}
          caption="Verified riders"
        />
        <StatCard
          icon={ShoppingBag}
          label="Today's Orders"
          value="0"
          caption="Platform total"
        />
        <StatCard
          icon={DollarSign}
          label="Gross Volume (GMV)"
          value="₦0.00"
          caption="Settled payments"
        />
      </div>

      {/* Operations Quick Action Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/approvals"
          className="card p-5 group transition-all duration-200 hover:shadow-md hover:border-brand-500/40 no-underline"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center">
              <UserCheck size={20} />
            </div>
            <ArrowRight size={16} className="text-neutral-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <h3 className="mt-4 font-bold text-ink text-base">Merchant & Rider Approvals</h3>
          <p className="mt-1.5 text-xs text-neutral-500">
            Permission-controlled verification before discovery or receiving dispatch orders.
          </p>
        </Link>

        <Link
          href="/admin/payments"
          className="card p-5 group transition-all duration-200 hover:shadow-md hover:border-brand-500/40 no-underline"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-ok/10 text-ok grid place-items-center">
              <CreditCard size={20} />
            </div>
            <ArrowRight size={16} className="text-neutral-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <h3 className="mt-4 font-bold text-ink text-base">Payments & Reconciliation</h3>
          <p className="mt-1.5 text-xs text-neutral-500">
            Audit Paystack references, ledger entries, idempotency keys, and webhook events.
          </p>
        </Link>

        <Link
          href="/admin/service-areas"
          className="card p-5 group transition-all duration-200 hover:shadow-md hover:border-brand-500/40 no-underline"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 grid place-items-center">
              <MapPin size={20} />
            </div>
            <ArrowRight size={16} className="text-neutral-400 group-hover:text-brand-500 transition-colors" />
          </div>
          <h3 className="mt-4 font-bold text-ink text-base">Service Areas & Geofences</h3>
          <p className="mt-1.5 text-xs text-neutral-500">
            Manage delivery clusters, launch zones, and operational radius in Ogun State.
          </p>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity / Audit Feed */}
        <ActivityFeed
          title="Platform Audit & Security Feed"
          items={RECENT_AUDIT_LOGS}
        />

        {/* Sales & Activity Chart */}
        <DashboardChart
          title="Network Volume & Order Trajectory"
          subtitle="Aggregated daily transaction flow"
          options={chartOptions}
          series={[]}
          emptyText="No transactions recorded yet in this environment."
        />
      </div>
    </div>
  );
}
