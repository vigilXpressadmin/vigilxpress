'use client';

import React, { useState } from 'react';
import { Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import { formatKobo } from '@/lib/shared/money';
import type { ProductSummary } from '@/lib/types';
import { useCart } from '@/lib/cart/use-cart';
import { useToast } from '@/components/ui/toast';

const FOOD_GRADIENTS = [
  'from-amber-400/20 via-orange-500/15 to-red-400/10',
  'from-orange-500/25 via-brand-500/15 to-amber-300/10',
  'from-emerald-500/20 via-teal-400/15 to-brand-500/10',
  'from-rose-500/20 via-orange-400/15 to-yellow-400/10',
];

export function ProductCard({ product }: { product: ProductSummary }) {
  const { items, addItem, updateQty } = useCart();
  const { showToast } = useToast();
  const [justAdded, setJustAdded] = useState(false);

  const existingInCart = items.find((i) => i.productId === product.id);
  const qtyInCart = existingInCart?.qty || 0;

  const gradient = FOOD_GRADIENTS[Math.abs(product.name.length) % FOOD_GRADIENTS.length];

  const handleAdd = () => {
    addItem({
      productId: product.id,
      merchantId: product.merchantId,
      merchantName: product.merchantName,
      name: product.name,
      priceKobo: product.priceKobo,
      qty: 1,
    });
    setJustAdded(true);
    showToast(`Added ${product.name} to cart`, 'success');
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <div className="card group flex flex-col justify-between p-4 sm:p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-brand-500/30">
      <div>
        {/* Visual Header */}
        <div className={`relative h-32 w-full rounded-2xl bg-gradient-to-br ${gradient} border border-black/5 p-3 flex flex-col justify-between overflow-hidden`}>
          <div className="flex items-center justify-between">
            {product.category && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-neutral-800 shadow-sm">
                {product.category}
              </span>
            )}
            <span className="text-[11px] font-medium text-neutral-600 bg-white/70 backdrop-blur-sm px-2 py-0.5 rounded-md">
              Abeokuta
            </span>
          </div>

          <div className="self-end p-2 rounded-xl bg-white/80 backdrop-blur-md shadow-sm">
            <ShoppingBag size={14} className="text-brand-500" />
          </div>
        </div>

        {/* Info */}
        <div className="mt-3.5">
          <h4 className="font-extrabold text-ink text-base leading-snug group-hover:text-brand-600 transition-colors">
            {product.name}
          </h4>
          <p className="mt-0.5 text-xs text-neutral-500 font-medium">{product.merchantName}</p>

          {product.description && (
            <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Footer Price & Actions */}
      <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between gap-3">
        <div>
          <span className="block text-[11px] text-neutral-400 uppercase font-semibold">Price</span>
          <strong className="text-base font-black text-ink">
            {formatKobo(product.priceKobo)}
          </strong>
        </div>

        {qtyInCart > 0 ? (
          <div className="flex items-center gap-1.5 bg-brand-500/10 border border-brand-500/30 rounded-xl p-1">
            <button
              type="button"
              onClick={() => updateQty(product.id, qtyInCart - 1)}
              className="w-7 h-7 rounded-lg bg-white grid place-items-center text-ink hover:bg-neutral-100 transition shadow-xs active:scale-90"
              aria-label={`Decrease quantity of ${product.name}`}
            >
              <Minus size={13} />
            </button>
            <span className="w-6 text-center text-xs font-black text-ink">{qtyInCart}</span>
            <button
              type="button"
              onClick={() => updateQty(product.id, qtyInCart + 1)}
              className="w-7 h-7 rounded-lg bg-brand-500 grid place-items-center text-ink hover:bg-brand-400 transition shadow-xs active:scale-90"
              aria-label={`Increase quantity of ${product.name}`}
            >
              <Plus size={13} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleAdd}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all active:scale-95 ${
              justAdded
                ? 'bg-ok text-white shadow-sm'
                : 'bg-brand-500 text-ink hover:bg-brand-400 hover:shadow-md hover:shadow-brand-500/20'
            }`}
          >
            {justAdded ? (
              <>
                <Check size={14} />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus size={14} />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
