import { getSupabaseAdmin, json } from '../_shared/supabase.ts';

Deno.serve(async () => json({ error: 'Refund processing disabled until approved policy and Paystack refund capability are verified' }, 501));
