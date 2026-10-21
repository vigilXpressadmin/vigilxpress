import React from 'react';
import { MerchantWalletCard } from '@/components/merchant/merchant-wallet-card';

export const metadata = {
  title: 'Merchant Wallet',
};

export default function MerchantWalletPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Wallet & Payouts
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Internal ledger balances are not bank payouts until settlement is verified.
        </p>
      </div>

      <MerchantWalletCard />
    </div>
  );
}
