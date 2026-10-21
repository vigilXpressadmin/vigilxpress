'use client';

import React from 'react';
import { Bike, ShieldCheck, Clock } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { DataTable, type Column, StatusBadge } from '@/components/dashboard/data-table';

interface RiderRow {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  approvalStatus: string;
  isOnline: boolean;
  createdAt: string;
  [key: string]: unknown;
}

const columns: Column<RiderRow>[] = [
  { key: 'id', header: 'Rider ID' },
  { key: 'name', header: 'Full Name' },
  { key: 'phone', header: 'Phone Number' },
  { key: 'vehicle', header: 'Vehicle / Zone' },
  {
    key: 'approvalStatus',
    header: 'Approval Status',
    render: (row) => <StatusBadge status={row.approvalStatus} />,
  },
  {
    key: 'isOnline',
    header: 'Shift Status',
    render: (row) => (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
          row.isOnline
            ? 'bg-ok/10 text-ok border-ok/20'
            : 'bg-neutral-100 text-neutral-500 border-neutral-200'
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            row.isOnline ? 'bg-ok animate-pulse' : 'bg-neutral-400'
          }`}
        />
        {row.isOnline ? 'Online' : 'Offline'}
      </span>
    ),
  },
  { key: 'createdAt', header: 'Registered' },
];

export default function AdminRidersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Delivery Fleet & Riders
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Manage contracted dispatch riders, monitor online shift statuses, and verify KYC records.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Bike}
          label="Total Fleet"
          value="0"
          caption="Registered riders in Ogun State"
        />
        <StatCard
          icon={Clock}
          label="Active on Shift"
          value="0"
          caption="Currently receiving jobs"
        />
        <StatCard
          icon={ShieldCheck}
          label="Pending KYC"
          value="0"
          caption="Awaiting admin approval"
        />
      </div>

      <DataTable
        title="Registered Delivery Riders"
        subtitle="Roster of contracted delivery partners and verification states"
        columns={columns}
        data={[]}
        emptyMessage="No registered riders found yet in the platform fleet."
      />
    </div>
  );
}
