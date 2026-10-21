'use client';

import React from 'react';
import Link from 'next/link';
import { PackageSearch, ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { DataTable, type Column } from '@/components/dashboard/data-table';

interface CustomerOrderRow {
  id: string;
  merchant: string;
  status: string;
  total: string;
  date: string;
  [key: string]: unknown;
}

const columns: Column<CustomerOrderRow>[] = [
  { key: 'id', header: 'Order ID' },
  { key: 'merchant', header: 'Store' },
  { key: 'date', header: 'Placed On' },
  { key: 'total', header: 'Amount' },
  { key: 'status', header: 'Status' },
];

export default function CustomerOrdersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Order History
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Track active deliveries, review past restaurant orders and verify pickup PINs.
          </p>
        </div>

        <Link
          href="/stores"
          className="btn-primary !py-2.5 !px-5 text-xs self-start sm:self-auto no-underline"
        >
          <ShoppingBag size={15} />
          <span>Browse Stores</span>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={PackageSearch}
          label="Active Deliveries"
          value="0"
          caption="En route right now"
        />
        <StatCard
          icon={Clock}
          label="Past Orders"
          value="0"
          caption="All time orders"
        />
        <StatCard
          icon={CheckCircle}
          label="Delivered On-Time"
          value="100%"
          caption="Abeokuta zone delivery"
        />
      </div>

      <DataTable
        title="Recent Orders"
        subtitle="Customer order history listing parent orders and merchant-specific tracking"
        columns={columns}
        data={[]}
        emptyMessage="No orders found yet. Browse stores to place your first order in Abeokuta!"
      />
    </div>
  );
}
