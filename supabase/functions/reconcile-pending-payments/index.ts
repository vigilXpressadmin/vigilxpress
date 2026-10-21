import { getSupabaseAdmin, json } from '../_shared/supabase.ts';
import { paystackVerify } from '../_shared/paystack.ts';

Deno.serve(async () => {
  const supabase = getSupabaseAdmin();
  const { data: payments } = await supabase.from('payments').select('*').in('status', ['initialized','pending']).lt('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString()).limit(25);
  const results = [] as unknown[];
  for (const payment of payments ?? []) {
    try { const verified = await paystackVerify(payment.reference); results.push({ reference: payment.reference, providerStatus: verified.status }); } catch (error) { results.push({ reference: payment.reference, error: error instanceof Error ? error.message : 'failed' }); }
  }
  return json({ checked: results.length, results });
});
