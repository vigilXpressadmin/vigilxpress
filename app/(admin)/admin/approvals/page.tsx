import React from 'react';
import { UserCheck, ShieldCheck, Clock } from 'lucide-react';

export const metadata = {
  title: 'Merchant & Rider Approvals',
};

export default function AdminApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Partner Approvals
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Approve merchants and riders before they become discoverable or receivable.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center">
              <UserCheck size={20} />
            </div>
            <div>
              <h2 className="font-bold text-ink">Merchant Verification</h2>
              <p className="text-xs text-neutral-500">Business registration & kitchen address</p>
            </div>
          </div>
          <div className="rounded-xl bg-soft/60 p-4 border border-line text-sm text-neutral-600">
            No pending merchant applications in queue.
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ok/10 text-ok grid place-items-center">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="font-bold text-ink">Rider KYC & Bike Inspection</h2>
              <p className="text-xs text-neutral-500">Drivers license, vehicle papers, guarantor</p>
            </div>
          </div>
          <div className="rounded-xl bg-soft/60 p-4 border border-line text-sm text-neutral-600">
            No pending rider onboarding documents to review.
          </div>
        </div>
      </div>
    </div>
  );
}
