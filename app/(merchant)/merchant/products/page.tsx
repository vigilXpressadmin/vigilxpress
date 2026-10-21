import React from 'react';
import { UtensilsCrossed, ShieldCheck, Plus } from 'lucide-react';

export const metadata = {
  title: 'Menu & Catalogue',
};

export default function MerchantProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Store Catalogue & Menu
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            Create and edit dishes, manage item availability, and upload photos to Supabase Storage.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary !py-2.5 !px-4 text-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add New Item</span>
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center">
            <UtensilsCrossed size={20} />
          </div>
          <div>
            <h2 className="font-bold text-ink">Catalog Items</h2>
            <p className="text-xs text-neutral-500">
              Merchants can modify only their own <code>stores</code> and <code>products</code> under RLS.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-soft/60 p-8 border border-dashed border-line text-center text-sm text-neutral-500">
          No menu items created yet. Click &ldquo;Add New Item&rdquo; to publish dishes to your store.
        </div>
      </div>
    </div>
  );
}
