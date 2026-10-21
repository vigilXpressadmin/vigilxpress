'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, MapPin, Store, SlidersHorizontal, X } from 'lucide-react';
import type { MerchantSummary } from '@/lib/types';
import { MerchantCard } from '@/components/customer/merchant-card';

const CATEGORIES = ['All', 'Food', 'Grocery', 'Drinks'];
const LOCATIONS = ['All Abeokuta', 'Oke-Ilewo', 'Kuto', 'Ibara', 'Camp / FUNAAB', 'Adigbe'];

export function StoresDirectory({ initialMerchants }: { initialMerchants: MerchantSummary[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All Abeokuta');

  const filteredMerchants = useMemo(() => {
    return initialMerchants.filter((merchant) => {
      // Category filter
      if (selectedCategory !== 'All' && merchant.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Location filter
      if (selectedLocation !== 'All Abeokuta') {
        const areaMatch = merchant.area?.toLowerCase().includes(selectedLocation.toLowerCase());
        if (!areaMatch) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = merchant.name.toLowerCase().includes(q);
        const descMatch = merchant.description?.toLowerCase().includes(q);
        const catMatch = merchant.category.toLowerCase().includes(q);
        const tagMatch = merchant.tags?.some((t) => t.toLowerCase().includes(q));
        if (!nameMatch && !descMatch && !catMatch && !tagMatch) return false;
      }

      return true;
    });
  }, [initialMerchants, selectedCategory, selectedLocation, searchQuery]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All' || selectedLocation !== 'All Abeokuta';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLocation('All Abeokuta');
  };

  return (
    <div className="space-y-8">
      {/* Search & Location Bar */}
      <div className="card p-4 sm:p-6 shadow-sm border border-line/80 bg-white">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          {/* Text search */}
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search kitchens, dishes (e.g. amala, jollof, suya, groceries)…"
              className="w-full rounded-xl border border-line bg-soft pl-10 pr-4 py-3 text-sm text-ink placeholder-neutral-400 outline-none focus:border-brand-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-ink p-1"
                aria-label="Clear search query"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Location Selector */}
          <div className="relative">
            <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-500 pointer-events-none" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full rounded-xl border border-line bg-soft pl-10 pr-4 py-3 text-sm font-semibold text-ink outline-none focus:border-brand-500 focus:bg-white transition appearance-none cursor-pointer"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills & Active Filter Bar */}
        <div className="mt-4 pt-4 border-t border-line/60 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap active:scale-95 ${
                    isSelected
                      ? 'bg-brand-500 text-ink shadow-sm'
                      : 'bg-soft text-neutral-600 hover:bg-neutral-200/80 hover:text-ink'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 ml-auto"
            >
              <X size={12} />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-neutral-500 font-medium">
        <span>
          Showing <strong className="text-ink font-bold">{filteredMerchants.length}</strong>{' '}
          {filteredMerchants.length === 1 ? 'store' : 'stores'} in {selectedLocation}
        </span>
        <span className="flex items-center gap-1 text-xs">
          <Store size={13} className="text-ok" />
          <Link href="/contact" className="font-bold text-brand-600 hover:underline">Confirm delivery availability</Link>
        </span>
      </div>

      {/* Grid of Stores */}
      {filteredMerchants.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredMerchants.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-brand-500/10 text-brand-500 grid place-items-center mx-auto mb-4">
            <Store size={28} />
          </div>
          <h3 className="text-lg font-bold text-ink">No stores match your search</h3>
          <p className="mt-1 text-sm text-neutral-500">
            We couldn&apos;t find any merchants matching &quot;{searchQuery}&quot; in {selectedLocation}. Try adjusting your keywords or category.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="btn-secondary mt-6"
          >
            Reset all filters
          </button>
        </div>
      )}
    </div>
  );
}
