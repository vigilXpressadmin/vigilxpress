import React from 'react';
import { MapPin, Plus, Home, Building2 } from 'lucide-react';

export const metadata = {
  title: 'Saved Addresses',
};

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Delivery Addresses
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Saved homes, offices, and campus spots for fast checkout in Abeokuta.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary !py-2.5 !px-4 text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Address</span>
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center">
            <MapPin size={20} />
          </div>
          <div>
            <h2 className="font-bold text-ink">Customer Address Book</h2>
            <p className="text-xs text-neutral-500">
              Address CRUD is backed securely by <code>customer_addresses</code> with Row-Level Security.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-soft/60 p-8 border border-dashed border-line text-center text-sm text-neutral-500">
          No saved addresses yet. Click &ldquo;Add New Address&rdquo; to save your delivery location.
        </div>
      </div>
    </div>
  );
}
