import { json } from '../_shared/supabase.ts';
Deno.serve(async () => json({ error: 'Withdrawals are disabled until settlement policy, provider capability and security controls are approved' }, 501));
