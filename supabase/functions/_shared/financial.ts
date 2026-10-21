import { getSupabaseAdmin } from './supabase.ts';

export async function allocatePaymentOnce(paymentId: string) {
  const supabase = getSupabaseAdmin();
  const { data: payment } = await supabase.from('payments').select('*, order_groups(id, customer_id, payable_kobo, currency)').eq('id', paymentId).single();
  if (!payment) throw new Error('Payment not found');
  const { data: merchantOrders } = await supabase.from('orders').select('id, merchant_id, subtotal_kobo').eq('order_group_id', payment.order_group_id);
  const policy = await getPolicy();
  for (const order of merchantOrders ?? []) {
    const gross = order.subtotal_kobo;
    const commission = Math.trunc((gross * policy.commissionBps) / 10000);
    const net = gross - commission;
    const merchantAccount = await ensureLedgerAccount('merchant', order.merchant_id);
    const platformAccount = await ensureLedgerAccount('platform', null);
    await insertLedger(merchantAccount.id, payment.order_group_id, order.id, paymentId, 'merchant_allocation', 'credit', net, `alloc:${payment.reference}:${order.id}`);
    await insertLedger(platformAccount.id, payment.order_group_id, order.id, paymentId, 'platform_commission', 'credit', commission, `comm:${payment.reference}:${order.id}`);
    await supabase.from('orders').update({ merchant_allocation_kobo: net, status: 'merchant_pending' }).eq('id', order.id);
  }
  await supabase.from('order_groups').update({ status: 'paid' }).eq('id', payment.order_group_id);
}

async function getPolicy() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from('financial_settings').select('value').eq('key', 'financial_policy').single();
  const value = data?.value ?? {};
  return { commissionBps: Number(value.commissionBps ?? Deno.env.get('PLATFORM_COMMISSION_BPS') ?? 0) };
}

async function ensureLedgerAccount(ownerType: 'platform'|'merchant', ownerId: string | null) {
  const supabase = getSupabaseAdmin();
  const query = supabase.from('ledger_accounts').select('*').eq('owner_type', ownerType);
  const { data } = ownerId ? await query.eq('owner_id', ownerId).maybeSingle() : await query.is('owner_id', null).maybeSingle();
  if (data) return data;
  const { data: created, error } = await supabase.from('ledger_accounts').insert({ owner_type: ownerType, owner_id: ownerId }).select().single();
  if (error) throw error;
  return created;
}

async function insertLedger(accountId: string, orderGroupId: string, orderId: string, paymentId: string, entryType: string, direction: 'debit'|'credit', amountKobo: number, idempotencyKey: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('ledger_entries').insert({ account_id: accountId, order_group_id: orderGroupId, order_id: orderId, payment_id: paymentId, entry_type: entryType, direction, amount_kobo: amountKobo, idempotency_key: idempotencyKey });
  if (error && error.code !== '23505') throw error;
}
