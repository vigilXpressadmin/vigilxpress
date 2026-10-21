import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-paystack-signature');
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      return NextResponse.json({ error: 'PAYSTACK_SECRET_KEY missing' }, { status: 500 });
    }

    // Verify HMAC-SHA512 signature
    const hash = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
    if (hash !== signature) {
      console.warn('Paystack webhook: invalid signature mismatch');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data;

    if (event === 'charge.success' && data?.status === 'success') {
      const reference = data.reference;
      const orderGroupId =
        data.metadata?.orderGroupId || data.metadata?.order_group_id;

      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },
            setAll() {},
          },
        }
      );

      const now = new Date().toISOString();

      try {
        // 1. Update payments record
        await supabase
          .from('payments')
          .update({
            status: 'paid',
            verified_at: now,
          })
          .eq('reference', reference);

        // 2. Update order_groups record to 'paid'
        if (orderGroupId) {
          await supabase
            .from('order_groups')
            .update({
              status: 'paid',
              updated_at: now,
            })
            .eq('id', orderGroupId);

          // 3. Update child orders to 'paid'
          await supabase
            .from('orders')
            .update({
              status: 'paid',
              updated_at: now,
            })
            .eq('order_group_id', orderGroupId);

          // 4. Log event
          await supabase.from('order_events').insert({
            order_group_id: orderGroupId,
            from_status: 'payment_pending',
            to_status: 'paid',
            metadata: {
              reference,
              amountKobo: data.amount,
              channel: data.channel,
              paid_at: data.paid_at,
              source: 'paystack_webhook',
            },
          });
        }
      } catch (dbErr) {
        console.warn('Paystack webhook: DB update non-fatal error:', dbErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Webhook error';
    console.error('Paystack webhook error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
