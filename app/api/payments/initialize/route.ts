import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Base delivery fee per kitchen (₦800 = 80000 kobo)
const BASE_DELIVERY_FEE_KOBO = 80000;
// Fixed platform service fee (₦350 = 35000 kobo)
const PLATFORM_SERVICE_FEE_KOBO = 35000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, items, orderGroupId: existingOrderGroupId } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required' }, { status: 400 });
    }

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

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const customerId = user?.id || 'guest-' + crypto.randomUUID();
    const customerEmail = (user?.email || body.email || '').trim();

    if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return NextResponse.json(
        { error: 'A valid email address is required to process Paystack payment. Please sign in or provide a valid email.' },
        { status: 400 }
      );
    }

    // 1. Calculate authoritative totals
    const subtotalKobo = items.reduce(
      (sum: number, it: { priceKobo?: number; qty?: number }) =>
        sum + (it.priceKobo || 0) * (it.qty || 1),
      0
    );

    const uniqueMerchants = Array.from(
      new Set(items.map((it: { merchantId?: string }) => it.merchantId || 'default-store'))
    );
    const deliveryFeeKobo = uniqueMerchants.length * BASE_DELIVERY_FEE_KOBO;
    const serviceFeeKobo = PLATFORM_SERVICE_FEE_KOBO;
    const totalKobo = subtotalKobo + deliveryFeeKobo + serviceFeeKobo;

    const orderGroupId = existingOrderGroupId || crypto.randomUUID();
    const reference = `VX-${orderGroupId.slice(0, 8)}-${Date.now()}`;

    // 2. Call Paystack Initialize API
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecret) {
      return NextResponse.json(
        { error: 'PAYSTACK_SECRET_KEY is not configured in server environment' },
        { status: 500 }
      );
    }

    const callbackUrl = `${
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }/account`;

    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customerEmail,
        amount: totalKobo,
        reference,
        callback_url: callbackUrl,
        metadata: {
          orderGroupId,
          customerId,
          address: address || {},
          itemsCount: items.length,
          custom_fields: [
            { display_name: 'Order Group ID', variable_name: 'order_group_id', value: orderGroupId },
            { display_name: 'Platform', variable_name: 'platform', value: 'VigilXpress' },
          ],
        },
        currency: 'NGN',
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackResponse.ok || !paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message || 'Failed to initialize Paystack transaction' },
        { status: 400 }
      );
    }

    const accessCode = paystackData.data.access_code;
    const authorizationUrl = paystackData.data.authorization_url;

    // 3. Persist order in Supabase defensively (do not fail transaction if table migration is pending)
    try {
      if (user?.id) {
        // Try inserting into order_groups
        const { error: groupError } = await supabase.from('order_groups').upsert({
          id: orderGroupId,
          customer_id: user.id,
          status: 'payment_pending',
          idempotency_key: `og-${orderGroupId}-${reference}`,
          delivery_address: address || {},
          payable_kobo: totalKobo,
          currency: 'NGN',
        });

        if (!groupError) {
          // Record payment initialization
          await supabase.from('payments').upsert({
            order_group_id: orderGroupId,
            provider: 'paystack',
            reference,
            access_code: accessCode,
            amount_kobo: totalKobo,
            currency: 'NGN',
            status: 'initialized',
            idempotency_key: `pay-${orderGroupId}-${reference}`,
          });
        }
      }
    } catch (dbErr) {
      console.warn('Initialize payment: DB upsert non-fatal fallback:', dbErr);
    }

    return NextResponse.json({
      success: true,
      orderGroupId,
      accessCode,
      reference,
      authorizationUrl,
      amountKobo: totalKobo,
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected payment error';
    console.error('Initialize payment error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
