export async function paystackInitialize(input: { email: string; amountKobo: number; reference: string; callbackUrl: string; metadata: Record<string, unknown> }) {
  const secret = Deno.env.get('PAYSTACK_SECRET_KEY');
  if (!secret) throw new Error('Missing PAYSTACK_SECRET_KEY');
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: input.email, amount: input.amountKobo, reference: input.reference, callback_url: input.callbackUrl, metadata: input.metadata, currency: 'NGN' })
  });
  const data = await res.json();
  if (!res.ok || !data.status) throw new Error(data.message || 'Paystack initialization failed');
  return data.data as { reference: string; access_code: string; authorization_url: string };
}

export async function paystackVerify(reference: string) {
  const secret = Deno.env.get('PAYSTACK_SECRET_KEY');
  if (!secret) throw new Error('Missing PAYSTACK_SECRET_KEY');
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, { headers: { Authorization: `Bearer ${secret}` } });
  const data = await res.json();
  if (!res.ok || !data.status) throw new Error(data.message || 'Paystack verification failed');
  return data.data as { status: string; reference: string; amount: number; currency: string; paid_at?: string };
}

export async function verifyPaystackSignature(rawBody: string, signature: string | null) {
  const secret = Deno.env.get('PAYSTACK_SECRET_KEY');
  if (!secret || !signature) return false;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody));
  const expected = btoa(String.fromCharCode(...new Uint8Array(digest)));
  return expected === signature;
}
