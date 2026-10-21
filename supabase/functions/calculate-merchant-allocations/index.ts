import { getSupabaseAdmin, getUserFromAuthHeader, json } from '../_shared/supabase.ts';
import { allocatePaymentOnce } from '../_shared/financial.ts';

Deno.serve(async (req) => {
  const user = await getUserFromAuthHeader(req);
  if (!user) return json({ error: 'Unauthorized' }, 401);
  const { paymentId } = await req.json().catch(() => ({}));
  if (!paymentId) return json({ error: 'paymentId required' }, 400);
  try { await allocatePaymentOnce(paymentId); return json({ ok: true }); } catch (error) { return json({ error: error instanceof Error ? error.message : 'Unexpected error' }, 500); }
});
