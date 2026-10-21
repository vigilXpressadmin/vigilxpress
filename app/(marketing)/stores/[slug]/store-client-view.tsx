'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Clock, MapPin, Store, Search, ShoppingBag } from 'lucide-react';
import type { MerchantSummary, ProductSummary } from '@/lib/types';
import { ProductCard } from '@/components/customer/product-card';
import { useCart } from '@/lib/cart/use-cart';

export function StoreClientView({
  merchant,
  products,
}: {
  merchant: MerchantSummary;
  products: ProductSummary[];
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [productSearch, setProductSearch] = useState('');
  const { itemCount, totalKobo } = useCart();

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (activeCategory !== 'All' && p.category !== activeCategory) {
        return false;
      }
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = p.description?.toLowerCase().includes(q);
        if (!nameMatch && !descMatch) return false;
      }
      return true;
    });
  }, [products, activeCategory, productSearch]);

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/stores"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-ink transition-colors no-underline"
        >
          <ArrowLeft size={14} />
          <span>Back to all stores</span>
        </Link>
      </div>

      {/* Store Header Banner */}
      <div className="card p-6 sm:p-8 bg-gradient-to-br from-brand-500/10 via-soft to-white border border-brand-500/20 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-brand-500 text-ink shadow-xs">
                {merchant.category}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-ok/10 text-ok border border-ok/20">
                <span className="w-1.5 h-1.5 rounded-full bg-ok animate-pulse" />
                Open for delivery
              </span>
              {merchant.area && (
                <span className="inline-flex items-center gap-1 text-xs text-neutral-600 font-semibold px-2.5 py-1 rounded-full bg-white/80 border border-line">
                  <MapPin size={12} className="text-brand-500" />
                  {merchant.area}, Abeokuta
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
              {merchant.name}
            </h1>

            {merchant.description && (
              <p className="text-sm sm:text-base text-neutral-600 max-w-2xl leading-relaxed">
                {merchant.description}
              </p>
            )}

            <div className="flex items-center gap-5 text-sm font-semibold text-neutral-700 pt-1 flex-wrap">
              <span className="flex items-center gap-1.5 text-amber-600 font-black">
                <Star size={15} className="fill-amber-400 text-amber-400" />
                {merchant.rating.toFixed(1)} / 5.0
              </span>
              <span className="flex items-center gap-1.5 text-neutral-700">
                <Clock size={15} className="text-brand-500" />
                Est. {merchant.deliveryEta}
              </span>
              <span className="flex items-center gap-1.5 text-neutral-500 text-xs">
                <Store size={14} className="text-neutral-400" />
                Verified Partner Kitchen
              </span>
            </div>
          </div>

          {/* Quick Cart Status Float if customer has items */}
          {itemCount > 0 && (
            <Link
              href="/cart"
              className="flex items-center gap-3 p-4 rounded-2xl bg-ink text-white hover:bg-neutral-800 transition shadow-lg shrink-0 no-underline"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500 text-ink grid place-items-center font-bold text-sm">
                <ShoppingBag size={20} />
              </div>
              <div>
                <span className="block text-xs font-bold text-brand-400">Cart updated</span>
                <span className="text-sm font-extrabold text-white">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Menu / Catalog Filters */}
      <div className="card p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-brand-500 text-ink shadow-xs'
                    : 'bg-soft text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search within store */}
        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            placeholder="Search menu items…"
            className="w-full rounded-xl border border-line bg-soft pl-9 pr-3 py-2 text-xs text-ink placeholder-neutral-400 outline-none focus:border-brand-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center max-w-md mx-auto">
          <p className="text-sm text-neutral-500">No dishes match your filter in this store.</p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('All');
              setProductSearch('');
            }}
            className="btn-secondary mt-4 text-xs"
          >
            Show full menu
          </button>
        </div>
      )}
    </div>
  );
}
