import React from 'react';
import { MerchantOrderBoard } from '@/components/merchant/merchant-order-board';

export const metadata = {
  title: 'Incoming Orders',
};

export default function MerchantOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Incoming Orders
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Accept/reject orders, mark prep status, trigger pickup dispatch and handle partial refunds.
        </p>
      </div>

      <MerchantOrderBoard />
    </div>
  );
}
