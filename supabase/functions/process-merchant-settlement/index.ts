import { getSupabaseAdmin, json } from '../_shared/supabase.ts';

Deno.serve(async () => {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from('financial_settings').select('value').eq('key', 'financial_policy').single();
  if (data?.value?.settlementsEnabled !== true) return json({ error: 'Settlements disabled' }, 501);
  return json({ error: 'Production settlement must use verified Paystack transfer/split capability only' }, 501);
});
