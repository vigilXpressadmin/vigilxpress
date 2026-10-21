'use client';

import React from 'react';
import { ShoppingBag, Clock, DollarSign } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { DataTable, type Column, StatusBadge } from '@/components/dashboard/data-table';
import { formatKobo } from '@/lib/shared/money';

interface AdminOrderRow {
  id: string;
  customer: string;
  store: string;
  subtotalKobo: number;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

const columns: Column<AdminOrderRow>[] = [
  { key: 'id', header: 'Order ID' },
  { key: 'customer', header: 'Customer' },
  { key: 'store', header: 'Store / Merchant' },
  {
    key: 'subtotalKobo',
    header: 'Subtotal',
    render: (row) => (
      <span className="font-semibold text-ink">
        {formatKobo(row.subtotalKobo)}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Order Status',
    render: (row) => <StatusBadge status={row.status} />,
  },
  { key: 'createdAt', header: 'Timestamp' },
];

export default function AdminOrdersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Platform Orders
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Global view of parent orders, merchant allocations, rider dispatch lifecycles, and exceptions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={ShoppingBag}
          label="Total Orders"
          value="0"
          caption="All time transactions"
        />
        <StatCard
          icon={Clock}
          label="Active Deliveries"
          value="0"
          caption="In progress right now"
        />
        <StatCard
          icon={DollarSign}
          label="Gross GMV"
          value="₦0.00"
          caption="Total settled platform volume"
        />
      </div>

      <DataTable
        title="All System Orders"
        subtitle="End-to-end order tracking across all registered merchants and customers"
        columns={columns}
        data={[]}
        emptyMessage="No platform orders recorded yet."
      />
    </div>
  );
}
