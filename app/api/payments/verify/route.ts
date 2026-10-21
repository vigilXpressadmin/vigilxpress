import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference, orderGroupId } = body;

    if (!reference) {
      return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 });
    }

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json(
        { error: 'PAYSTACK_SECRET_KEY is not configured on the server' },
        { status: 500 }
      );
    }

    // 1. Authoritative verification with Paystack API
    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${paystackSecret}`,
        },
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message || 'Payment verification query failed' },
        { status: 400 }
      );
    }

    const verificationResult = paystackData.data;
    const isPaid = verificationResult.status === 'success';

    if (!isPaid) {
      return NextResponse.json(
        {
          status: verificationResult.status,
          message: `Payment status is ${verificationResult.status}`,
        },
        { status: 400 }
      );
    }

    // 2. Update Supabase order and payment tables from 'pending' to 'paid'
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
    const targetGroupId =
      orderGroupId ||
      verificationResult.metadata?.orderGroupId ||
      verificationResult.metadata?.order_group_id;

    try {
      // Update payments record
      await supabase
        .from('payments')
        .update({
          status: 'paid',
          verified_at: now,
        })
        .eq('reference', reference);

      // Update order_groups from 'payment_pending' to 'paid'
      if (targetGroupId) {
        await supabase
          .from('order_groups')
          .update({
            status: 'paid',
            updated_at: now,
          })
          .eq('id', targetGroupId);

        // Update child orders to 'paid'
        await supabase
          .from('orders')
          .update({
            status: 'paid',
            updated_at: now,
          })
          .eq('order_group_id', targetGroupId);

        // Record order event
        await supabase.from('order_events').insert({
          order_group_id: targetGroupId,
          from_status: 'payment_pending',
          to_status: 'paid',
          metadata: {
            reference,
            amountKobo: verificationResult.amount,
            channel: verificationResult.channel,
            paid_at: verificationResult.paid_at,
          },
        });
      }
    } catch (dbErr) {
      console.warn('Verify payment: DB update non-fatal note:', dbErr);
    }

    return NextResponse.json({
      success: true,
      status: 'paid',
      orderGroupId: targetGroupId,
      reference,
      amountKobo: verificationResult.amount,
      paidAt: verificationResult.paid_at,
      message: 'Payment verified successfully and order status updated to paid.',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected verification error';
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
