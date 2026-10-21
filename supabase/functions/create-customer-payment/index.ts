import { getSupabaseAdmin, getUserFromAuthHeader, json } from '../_shared/supabase.ts';
import { paystackInitialize } from '../_shared/paystack.ts';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return json({ error: 'Unauthorized' }, 401);
    const { orderGroupId } = await req.json();
    if (!orderGroupId) return json({ error: 'orderGroupId is required' }, 400);
    const supabase = getSupabaseAdmin();
    const { data: group } = await supabase.from('order_groups').select('*').eq('id', orderGroupId).eq('customer_id', user.id).single();
    if (!group) return json({ error: 'Order group not found' }, 404);
    if (group.status !== 'payment_pending') return json({ error: 'Order is not payable' }, 409);
    const reference = `VX-${group.id}-${crypto.randomUUID()}`;
    const email = user.email ?? `${user.id}@customers.vigilxpress.local`;
    const initialized = await paystackInitialize({ email, amountKobo: group.payable_kobo, reference, callbackUrl: `${Deno.env.get('NEXT_PUBLIC_SITE_URL')}/orders/${group.id}`, metadata: { orderGroupId: group.id, customerId: user.id } });
    const { data: payment, error } = await supabase.from('payments').insert({ order_group_id: group.id, reference, access_code: initialized.access_code, amount_kobo: group.payable_kobo, currency: group.currency, status: 'initialized', idempotency_key: `pay:${group.id}:${initialized.reference}` }).select().single();
    if (error) throw error;
    return json({ paymentId: payment.id, reference: payment.reference, accessCode: initialized.access_code });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Unexpected error' }, 500);
  }
});
