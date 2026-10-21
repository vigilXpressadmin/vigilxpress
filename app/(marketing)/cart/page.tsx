'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, Store, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/cart/use-cart';
import { formatKobo } from '@/lib/shared/money';

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotalKobo,
    estimatedDeliveryFeeKobo,
    serviceFeeKobo,
    totalKobo,
    merchantGroups,
    updateQty,
    removeItem,
    clear,
  } = useCart();

  return (
    <div className="container-x pt-28 pb-20">
      {/* Breadcrumb / back link */}
      <div className="mb-6">
        <Link
          href="/stores"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-ink transition-colors no-underline"
        >
          <ArrowLeft size={14} />
          <span>Continue browsing stores</span>
        </Link>
      </div>

      <div className="flex items-center justify-between pb-6 border-b border-line/80 flex-wrap gap-4">
        <div>
          <span className="eb">Multi-Kitchen Cart</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            Review Your Order
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            {itemCount > 0
              ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} from ${merchantGroups.length} ${
                  merchantGroups.length === 1 ? 'kitchen' : 'different kitchens'
                } across Abeokuta.`
              : 'Your cart is currently empty.'}
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition"
          >
            <Trash2 size={13} />
            <span>Empty cart</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card mt-10 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-brand-500/10 text-brand-500 grid place-items-center mx-auto mb-4">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-xl font-bold text-ink">Your cart is empty</h2>
          <p className="mt-2 text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Explore verified local kitchens and grocery stores in Abeokuta to order hot meals and daily essentials.
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/stores" className="btn-primary">
              Browse stores &amp; menus
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Left Column: Groups by Kitchen */}
          <div className="space-y-6">
            {merchantGroups.map((group) => (
              <section
                key={group.merchantId}
                className="card p-6 shadow-sm border border-line/80 bg-white relative overflow-hidden"
              >
                {/* Kitchen Header */}
                <div className="flex items-center justify-between pb-4 border-b border-line/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 grid place-items-center flex-none">
                      <Store size={16} />
                    </div>
                    <div>
                      <h2 className="font-extrabold text-ink text-base">
                        {group.merchantName}
                      </h2>
                      <span className="text-[11px] font-semibold text-neutral-400">
                        {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md">
                    Subtotal: {formatKobo(group.groupSubtotalKobo)}
                  </span>
                </div>

                {/* Items in this Kitchen */}
                <div className="mt-4 divide-y divide-line/40">
                  {group.items.map((item) => (
                    <div
                      key={item.productId}
                      className="py-3.5 flex items-center justify-between gap-4 first:pt-1 last:pb-1"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-ink truncate">{item.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {formatKobo(item.priceKobo)} each
                        </p>
                      </div>

                      {/* Quantity Controller & Price */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center gap-1.5 bg-soft border border-line rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => updateQty(item.productId, item.qty - 1)}
                            className="w-7 h-7 rounded-lg bg-white grid place-items-center text-ink hover:bg-neutral-100 transition shadow-xs active:scale-90"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus size={13} />
                          </button>
                          <span className="w-6 text-center text-xs font-black text-ink">
                            {item.qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.productId, item.qty + 1)}
                            className="w-7 h-7 rounded-lg bg-white grid place-items-center text-ink hover:bg-neutral-100 transition shadow-xs active:scale-90"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        <strong className="text-sm font-extrabold text-ink w-20 text-right">
                          {formatKobo(item.priceKobo * item.qty)}
                        </strong>

                        <button
                          type="button"
                          onClick={() => removeItem(item.productId)}
                          className="text-neutral-400 hover:text-red-600 p-1 transition"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* Promise Reminder Card */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-medium flex items-center gap-3">
              <ShieldCheck size={20} className="text-amber-600 shrink-0" />
              <span>
                <strong>Vigil Handover Promise:</strong> Pay securely with Paystack. Your delivery PIN will be generated and shown to you. Hand over the PIN only when the rider delivers your package.
              </span>
            </div>
          </div>

          {/* Right Column: Order Summary Card */}
          <aside className="card h-fit p-6 shadow-md border border-line/80 bg-white space-y-5">
            <h3 className="font-extrabold text-lg text-ink">Order Summary</h3>

            <div className="space-y-3 text-sm text-neutral-600 border-b border-line pb-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <strong className="text-ink">{formatKobo(subtotalKobo)}</strong>
              </div>

              <div className="flex justify-between">
                <div>
                  <span>Delivery Fee</span>
                  <small className="block text-[11px] text-neutral-400">
                    {merchantGroups.length} {merchantGroups.length === 1 ? 'kitchen' : 'kitchens'} × ₦800
                  </small>
                </div>
                <strong className="text-ink">{formatKobo(estimatedDeliveryFeeKobo)}</strong>
              </div>

              <div className="flex justify-between">
                <div>
                  <span>Service &amp; Technology Fee</span>
                  <small className="block text-[11px] text-neutral-400">Fixed platform fee</small>
                </div>
                <strong className="text-ink">{formatKobo(serviceFeeKobo)}</strong>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="font-extrabold text-base text-ink">Estimated Total</span>
              <strong className="font-black text-2xl text-brand-600">
                {formatKobo(totalKobo)}
              </strong>
            </div>

            <p className="text-[12px] text-neutral-500 leading-snug">
              Fees are guaranteed transparent with no hidden surcharges. Final payment is authorized through Paystack.
            </p>

            <Link
              href="/checkout"
              className="btn-primary w-full py-3.5 shadow-md shadow-brand-500/20 no-underline"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
