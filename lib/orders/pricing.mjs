import { addKobo, multiplyKobo } from '../shared/money.mjs';
export function calculateQuote(items, fees) {
  const subtotal = addKobo(...items.map((i) => multiplyKobo(i.priceKobo, i.qty)));
  const deliveryFeeKobo = Math.trunc(fees?.deliveryFeeKobo || 0);
  const serviceFeeKobo = Math.trunc(fees?.serviceFeeKobo || 0);
  const discountKobo = Math.min(Math.trunc(fees?.discountKobo || 0), subtotal);
  return { subtotalKobo: subtotal, deliveryFeeKobo, serviceFeeKobo, discountKobo, payableKobo: subtotal + deliveryFeeKobo + serviceFeeKobo - discountKobo };
}
export function canTransition(from, to) {
  const allowed = {
    payment_pending: ['paid','cancelled','exception'],
    paid: ['merchant_pending','refund_pending','exception'],
    merchant_pending: ['accepted','cancelled','refund_pending','exception'],
    accepted: ['preparing','cancelled','refund_pending'],
    preparing: ['ready_for_pickup','cancelled','refund_pending'],
    ready_for_pickup: ['rider_assigned','cancelled','refund_pending'],
    rider_assigned: ['picked_up','exception'],
    picked_up: ['in_transit','delivered'],
    in_transit: ['delivered','exception'],
    delivered: [],
    cancelled: ['refund_pending'],
    refund_pending: ['refunded','exception'],
    refunded: [],
    exception: ['refund_pending','cancelled','paid']
  };
  return (allowed[from] || []).includes(to);
}
