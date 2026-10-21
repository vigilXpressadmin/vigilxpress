import { getSupabaseAdmin, getUserFromAuthHeader, json } from '../_shared/supabase.ts';

Deno.serve(async (req) => {
  const user = await getUserFromAuthHeader(req);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const { paymentId, orderId, amountKobo, reason } = await req.json();
  if (!paymentId || !amountKobo || !reason) return json({ error: 'paymentId, amountKobo and reason are required' }, 400);
  const supabase = getSupabaseAdmin();
  const { data: payment } = await supabase.from('payments').select('*, order_groups(customer_id)').eq('id', paymentId).single();
  if (!payment || payment.order_groups.customer_id !== user.id) return json({ error: 'Refund not permitted' }, 403);
  const { data, error } = await supabase.from('refunds').insert({ payment_id: paymentId, order_group_id: payment.order_group_id, order_id: orderId ?? null, amount_kobo: amountKobo, reason, idempotency_key: `refund-request:${paymentId}:${orderId ?? 'group'}:${amountKobo}` }).select().single();
  if (error) return json({ error: error.message }, 500);
  return json({ refundId: data.id, status: data.status });
});
