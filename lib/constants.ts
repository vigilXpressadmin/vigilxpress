export const BRAND = 'VIGILXpress';
export const ORDER_STATES = ['payment_pending','paid','merchant_pending','accepted','preparing','ready_for_pickup','rider_assigned','picked_up','in_transit','delivered','cancelled','refund_pending','refunded','exception'] as const;
export type OrderState = typeof ORDER_STATES[number];
export const SETTLEMENT_ENABLED = false;
