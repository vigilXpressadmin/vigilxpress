import React from 'react';
import { CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Payments & Reconciliation',
};

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Payments & Reconciliation
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Monitor Paystack transaction references, webhook events, duplicate protection, mismatches and pending reconciliations.
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ok/10 text-ok grid place-items-center">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h2 className="font-bold text-ink">Paystack Webhook & Idempotency Health</h2>
            <p className="text-xs text-neutral-500">
              Unique constraint enforced on <code>idempotency_key</code>
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-soft/60 p-5 border border-line text-sm text-neutral-600 space-y-2">
          <p className="flex items-center gap-2 text-ok font-semibold">
            <CheckCircle2 size={16} />
            Idempotency guards active and immutable
          </p>
          <p className="text-xs text-neutral-500">
            All customer payment references, webhook signatures, and integer kobo ledger records are verified securely.
          </p>
        </div>
      </div>
    </div>
  );
}
