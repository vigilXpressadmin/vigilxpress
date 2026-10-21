'use client';

import React from 'react';
import { Users, UserCheck, Shield } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { DataTable, type Column } from '@/components/dashboard/data-table';

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  createdAt: string;
  [key: string]: unknown;
}

const columns: Column<CustomerRow>[] = [
  { key: 'id', header: 'Customer ID' },
  { key: 'name', header: 'Full Name' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Phone' },
  { key: 'ordersCount', header: 'Total Orders', align: 'center' },
  { key: 'createdAt', header: 'Joined' },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Registered Customers
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          User profiles, order frequency, delivery contact details, and account statuses.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={Users}
          label="Total Customers"
          value="0"
          caption="Registered platform accounts"
        />
        <StatCard
          icon={UserCheck}
          label="Active This Month"
          value="0"
          caption="Placed at least 1 order"
        />
        <StatCard
          icon={Shield}
          label="Verified Profiles"
          value="0"
          caption="Phone and email verified"
        />
      </div>

      <DataTable
        title="Customer Directory"
        subtitle="Directory of customer accounts in the Abeokuta delivery area"
        columns={columns}
        data={[]}
        emptyMessage="No registered customers found yet."
      />
    </div>
  );
}
