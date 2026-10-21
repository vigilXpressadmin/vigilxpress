'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import type { CartItem } from '@/lib/types';

const KEY = 'vigilxpress-cart-v1';

// Base delivery fee per kitchen in Abeokuta (₦800)
export const BASE_DELIVERY_FEE_KOBO = 80000;
// Fixed platform tech service fee (₦350)
export const PLATFORM_SERVICE_FEE_KOBO = 35000;

// In-memory singleton state
let globalCart: CartItem[] = [];
let isInitialized = false;
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(KEY, JSON.stringify(globalCart));
    } catch {
      // LocalStorage quota or access denied fallback
    }
  }
  listeners.forEach((listener) => listener());
}

function initCartOnce() {
  if (isInitialized || typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        globalCart = parsed;
      }
    }
  } catch {
    globalCart = [];
  }
  isInitialized = true;
}

export interface MerchantGroup {
  merchantId: string;
  merchantName: string;
  items: CartItem[];
  groupSubtotalKobo: number;
}

export interface UseCartReturn {
  items: CartItem[];
  itemCount: number;
  subtotalKobo: number;
  estimatedDeliveryFeeKobo: number;
  serviceFeeKobo: number;
  totalKobo: number;
  merchantGroups: MerchantGroup[];
  addItem: (item: CartItem) => void;
  updateQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

export function useCart(): UseCartReturn {
  initCartOnce();

  const [, setTick] = useState(0);

  useEffect(() => {
    initCartOnce();
    const handleUpdate = () => setTick((t) => t + 1);
    listeners.add(handleUpdate);

    // Sync across browser tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        try {
          globalCart = e.newValue ? JSON.parse(e.newValue) : [];
          handleUpdate();
        } catch {
          // ignore parsing error
        }
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      listeners.delete(handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const addItem = useCallback((item: CartItem) => {
    const existingIndex = globalCart.findIndex((i) => i.productId === item.productId);
    if (existingIndex > -1) {
      globalCart = globalCart.map((it, idx) =>
        idx === existingIndex ? { ...it, qty: it.qty + (item.qty || 1) } : it
      );
    } else {
      globalCart = [...globalCart, { ...item, qty: Math.max(1, item.qty || 1) }];
    }
    notify();
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    if (qty <= 0) {
      globalCart = globalCart.filter((i) => i.productId !== productId);
    } else {
      globalCart = globalCart.map((i) =>
        i.productId === productId ? { ...i, qty } : i
      );
    }
    notify();
  }, []);

  const removeItem = useCallback((productId: string) => {
    globalCart = globalCart.filter((i) => i.productId !== productId);
    notify();
  }, []);

  const clear = useCallback(() => {
    globalCart = [];
    notify();
  }, []);

  const items = globalCart;

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + (item.qty || 0), 0),
    [items]
  );

  const subtotalKobo = useMemo(
    () => items.reduce((sum, item) => sum + (item.priceKobo || 0) * (item.qty || 1), 0),
    [items]
  );

  const merchantGroups = useMemo<MerchantGroup[]>(() => {
    const groupMap: Record<string, MerchantGroup> = {};
    for (const item of items) {
      const key = item.merchantId;
      if (!groupMap[key]) {
        groupMap[key] = {
          merchantId: item.merchantId,
          merchantName: item.merchantName || 'Verified Merchant',
          items: [],
          groupSubtotalKobo: 0,
        };
      }
      groupMap[key].items.push(item);
      groupMap[key].groupSubtotalKobo += (item.priceKobo || 0) * (item.qty || 1);
    }
    return Object.values(groupMap);
  }, [items]);

  // Delivery fee: ₦800 per unique kitchen/store (One Cart, Multiple Kitchens)
  const estimatedDeliveryFeeKobo = useMemo(() => {
    if (merchantGroups.length === 0) return 0;
    return merchantGroups.length * BASE_DELIVERY_FEE_KOBO;
  }, [merchantGroups.length]);

  // Service fee: ₦350 if any items in cart
  const serviceFeeKobo = useMemo(() => {
    return items.length > 0 ? PLATFORM_SERVICE_FEE_KOBO : 0;
  }, [items.length]);

  const totalKobo = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotalKobo + estimatedDeliveryFeeKobo + serviceFeeKobo;
  }, [items.length, subtotalKobo, estimatedDeliveryFeeKobo, serviceFeeKobo]);

  return {
    items,
    itemCount,
    subtotalKobo,
    estimatedDeliveryFeeKobo,
    serviceFeeKobo,
    totalKobo,
    merchantGroups,
    addItem,
    updateQty,
    removeItem,
    clear,
  };
}
