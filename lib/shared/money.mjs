export function toKobo(naira) {
  if (!Number.isFinite(naira)) throw new Error('Invalid naira amount');
  return Math.round(naira * 100);
}
export function addKobo(...amounts) { return amounts.reduce((a, b) => a + Math.trunc(b), 0); }
export function multiplyKobo(amount, qty) { return Math.trunc(amount) * Math.trunc(qty); }
export function allocationForMerchant(grossKobo, commissionBps) {
  const commission = Math.trunc((Math.trunc(grossKobo) * Math.trunc(commissionBps)) / 10000);
  return { grossKobo: Math.trunc(grossKobo), commissionKobo: commission, netKobo: Math.trunc(grossKobo) - commission };
}
export function formatKobo(kobo, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency }).format((Math.trunc(kobo) || 0) / 100);
}
