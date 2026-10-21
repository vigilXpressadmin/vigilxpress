import test from 'node:test';
import assert from 'node:assert/strict';
import { addKobo, allocationForMerchant, formatKobo, multiplyKobo, toKobo } from '../lib/shared/money.mjs';
import { calculateQuote, canTransition } from '../lib/orders/pricing.mjs';

test('integer kobo arithmetic', () => { assert.equal(toKobo(5.5), 550); assert.equal(addKobo(100, 250), 350); assert.equal(multiplyKobo(550, 3), 1650); });
test('quote is authoritative and discount capped', () => { const quote = calculateQuote([{ priceKobo: 1000, qty: 2 }], { deliveryFeeKobo: 500, serviceFeeKobo: 100, discountKobo: 5000 }); assert.deepEqual(quote, { subtotalKobo: 2000, deliveryFeeKobo: 500, serviceFeeKobo: 100, discountKobo: 2000, payableKobo: 600 }); });
test('merchant allocation commission', () => { assert.deepEqual(allocationForMerchant(10000, 1250), { grossKobo: 10000, commissionKobo: 1250, netKobo: 8750 }); });
test('formatting', () => { assert.match(formatKobo(550000), /₦|NGN/); });
test('order transitions guard illegal moves', () => { assert.equal(canTransition('payment_pending','paid'), true); assert.equal(canTransition('delivered','paid'), false); assert.equal(canTransition('merchant_pending','delivered'), false); });
