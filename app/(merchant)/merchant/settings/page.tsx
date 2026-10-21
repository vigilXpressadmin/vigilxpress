'use client';

import React from 'react';
import { Store, AlertCircle, Building2, MapPin, Clock, ShieldAlert } from 'lucide-react';

export default function MerchantSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Store Settings & Configuration
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Manage your restaurant profile, service location, operating schedule, and settlement bank.
        </p>
      </div>

      {/* Prominent Disabled Alert Note */}
      <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-900 text-sm">
        <ShieldAlert size={20} className="text-amber-600 flex-none mt-0.5" />
        <div>
          <strong className="font-bold block">Contact support to change store details</strong>
          <p className="mt-0.5 text-xs text-amber-800 leading-relaxed">
            Store identity, legal business name, physical kitchen address, and settlement bank accounts are locked
            under platform governance. To update these records, submit a verification request to platform operations.
          </p>
        </div>
      </div>

      <div className="card p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-line">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center">
            <Store size={20} />
          </div>
          <div>
            <h2 className="font-bold text-ink">Store Profile Information</h2>
            <p className="text-xs text-neutral-500">Read-only store attributes verified during onboarding</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label block text-xs font-semibold text-neutral-600 mb-1.5">
                Store / Brand Name
              </label>
              <input
                type="text"
                disabled
                defaultValue="Merchant Store"
                className="input bg-neutral-100/70 text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="label block text-xs font-semibold text-neutral-600 mb-1.5">
                Primary Category
              </label>
              <input
                type="text"
                disabled
                defaultValue="Food & Kitchen"
                className="input bg-neutral-100/70 text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="label block text-xs font-semibold text-neutral-600 mb-1.5">
                Service Area / City
              </label>
              <input
                type="text"
                disabled
                defaultValue="Abeokuta, Ogun State"
                className="input bg-neutral-100/70 text-neutral-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="label block text-xs font-semibold text-neutral-600 mb-1.5">
                Operating Schedule
              </label>
              <input
                type="text"
                disabled
                defaultValue="08:00 AM – 10:00 PM (Daily)"
                className="input bg-neutral-100/70 text-neutral-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-line">
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">
              Settlement Banking Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label block text-xs font-semibold text-neutral-600 mb-1.5">
                  Bank Name
                </label>
                <input
                  type="text"
                  disabled
                  defaultValue="Paystack-Verified Commercial Bank"
                  className="input bg-neutral-100/70 text-neutral-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="label block text-xs font-semibold text-neutral-600 mb-1.5">
                  Account Number (NUBAN)
                </label>
                <input
                  type="text"
                  disabled
                  defaultValue="••••••••••"
                  className="input bg-neutral-100/70 text-neutral-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
