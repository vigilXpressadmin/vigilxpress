import React from 'react';
import { OrderStatusTimeline } from '@/components/customer/order-status-timeline';
import { PackageSearch } from 'lucide-react';

export const metadata = {
  title: 'Order Status Timeline',
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center">
          <PackageSearch size={20} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Order #{id}
          </h1>
          <p className="mt-0.5 text-xs text-neutral-500">Live order tracking and milestone progress</p>
        </div>
      </div>

      <div className="card p-6">
        <OrderStatusTimeline current="paid" />
      </div>
    </div>
  );
}
