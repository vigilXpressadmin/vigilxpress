import { getSupabaseAdmin, json } from '../_shared/supabase.ts';
import { verifyPaystackSignature } from '../_shared/paystack.ts';
import { allocatePaymentOnce } from '../_shared/financial.ts';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const raw = await req.text();
  const signature = req.headers.get('x-paystack-signature');
  if (!(await verifyPaystackSignature(raw, signature))) return json({ error: 'Invalid signature' }, 401);
  const event = JSON.parse(raw);
  const supabase = getSupabaseAdmin();
  const { error: eventError } = await supabase.from('payment_events').insert({ provider_event_id: event.id, event_type: event.event, payload: event }).onConflict('provider_event_id').ignore();
  if (eventError) return json({ error: eventError.message }, 500);
  if (event.event !== 'charge.success') return json({ received: true });
  const reference = event.data?.reference;
  const { data: payment } = await supabase.from('payments').select('*').eq('reference', reference).maybeSingle();
  if (!payment) return json({ received: true, note: 'Payment not found' });
  const amountMatches = Number(event.data?.amount) === payment.amount_kobo;
  const currencyMatches = event.data?.currency === payment.currency;
  if (!amountMatches || !currencyMatches) {
    await supabase.from('order_groups').update({ status: 'exception' }).eq('id', payment.order_group_id);
    return json({ error: 'Amount/currency mismatch' }, 409);
  }
  if (payment.status !== 'paid') {
    await supabase.from('payments').update({ status: 'paid', verified_at: new Date().toISOString() }).eq('id', payment.id);
    await allocatePaymentOnce(payment.id);
  }
  return json({ received: true });
});
