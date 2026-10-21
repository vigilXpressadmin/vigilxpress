'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { formatKobo } from '@/lib/shared/money';
import { StatusBadge } from '@/components/dashboard/data-table';
import { ShoppingBag, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

interface OrderItem {
  id: string;
  customer: string;
  status: string;
  totalKobo: number;
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-demo-1',
    customer: 'Customer (Ibara, Abeokuta)',
    status: 'merchant_pending',
    totalKobo: 550000,
  },
];

export function MerchantOrderBoard() {
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const { showToast } = useToast();

  const handleAction = (id: string, newStatus: string, actionLabel: string, variant: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    showToast(`Order ${id}: ${actionLabel}`, variant);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-ink">Live Order Queue</h2>
          <p className="text-xs text-neutral-500">
            Real-time incoming orders awaiting merchant confirmation
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
          {orders.length} Active
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {orders.map((o) => (
          <div
            key={o.id}
            className="card p-5 transition-all duration-200 hover:shadow-md hover:border-brand-500/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center flex-none">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <strong className="text-base font-bold text-ink block">
                    Order #{o.id}
                  </strong>
                  <span className="text-xs text-neutral-500">
                    {formatKobo(o.totalKobo)}
                  </span>
                </div>
              </div>

              <StatusBadge status={o.status} />
            </div>

            <p className="mt-4 text-sm text-neutral-600 bg-soft/60 rounded-xl p-3 border border-line/60">
              <span className="text-xs text-neutral-400 block font-medium">Customer & Destination</span>
              {o.customer}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2 pt-2 border-t border-line/60">
              <button
                type="button"
                className="btn-primary !py-2 !px-4 text-xs"
                onClick={() => handleAction(o.id, 'accepted', 'Accepted and moved to kitchen prep', 'success')}
              >
                <CheckCircle2 size={14} />
                Accept
              </button>

              <button
                type="button"
                className="btn-secondary !py-2 !px-4 text-xs"
                onClick={() => handleAction(o.id, 'ready_for_pickup', 'Marked ready for rider dispatch', 'info')}
              >
                <ArrowRight size={14} />
                Mark ready
              </button>

              <button
                type="button"
                className="btn-secondary !py-2 !px-4 text-xs text-red-600 hover:text-red-700 hover:border-red-200"
                onClick={() => handleAction(o.id, 'cancelled', 'Order rejected', 'error')}
              >
                <XCircle size={14} />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
