import { getSupabaseAdmin, getUserFromAuthHeader, json } from '../_shared/supabase.ts';
import { paystackVerify } from '../_shared/paystack.ts';
import { allocatePaymentOnce } from '../_shared/financial.ts';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return json({ error: 'Unauthorized' }, 401);
    const { orderGroupId } = await req.json();
    const supabase = getSupabaseAdmin();
    const { data: group } = await supabase.from('order_groups').select('*').eq('id', orderGroupId).eq('customer_id', user.id).single();
    if (!group) return json({ error: 'Order group not found' }, 404);
    const { data: payment } = await supabase.from('payments').select('*').eq('order_group_id', group.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
    if (!payment) return json({ status: 'not_initialized' });
    if (payment.status === 'paid') return json({ status: 'paid', orderGroupId: group.id });
    const verified = await paystackVerify(payment.reference);
    if (verified.status !== 'success' || verified.amount !== payment.amount_kobo || verified.currency !== payment.currency || verified.reference !== payment.reference) {
      return json({ status: 'failed', message: 'Payment verification mismatch' }, 409);
    }
    const { error } = await supabase.from('payments').update({ status: 'paid', verified_at: new Date().toISOString() }).eq('id', payment.id).eq('status', payment.status);
    if (error) throw error;
    await allocatePaymentOnce(payment.id);
    return json({ status: 'paid', orderGroupId: group.id });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unexpected error' }, 500);
  }
});
