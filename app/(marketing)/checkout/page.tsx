'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, MapPin, CreditCard, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart/use-cart';
import { formatKobo } from '@/lib/shared/money';
import { createClient } from '@/lib/supabase/client';
import { PaystackCheckoutButton } from '@/components/payments/paystack-checkout-button';
import { useToast } from '@/components/ui/toast';
import { LiquidWaveSpinner } from '@/components/ui/spinner-10';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    subtotalKobo,
    estimatedDeliveryFeeKobo,
    serviceFeeKobo,
    totalKobo,
    merchantGroups,
    clear,
  } = useCart();

  const { showToast } = useToast();

  const [address, setAddress] = useState({
    label: 'Home',
    line1: '',
    area: 'Oke-Ilewo',
    city: 'Abeokuta',
    instructions: '',
  });

  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [orderGroupId, setOrderGroupId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Auth guard: redirect unauthenticated users to /login with return URL
  useEffect(() => {
    let isMounted = true;

    // Failsafe timeout: strictly dismiss loader after 3s so screen never gets stuck
    const failsafeTimer = setTimeout(() => {
      if (isMounted) {
        setLoadingAuth(false);
      }
    }, 3000);

    async function loadUserAndAddress() {
      try {
        const supabase = createClient();
        if (!supabase) {
          if (isMounted) {
            router.replace('/login?next=' + encodeURIComponent('/checkout'));
          }
          return;
        }

        const {
          data: { user: currentAuthUser },
        } = await supabase.auth.getUser();

        if (!currentAuthUser) {
          // Not logged in → redirect to login with return-to-checkout
          if (isMounted) {
            router.replace('/login?next=' + encodeURIComponent('/checkout'));
          }
          return;
        }

        if (isMounted) {
          setUser(currentAuthUser);
        }

        // Attempt loading default saved address
        const { data: savedAddresses } = await supabase
          .from('customer_addresses')
          .select('*')
          .eq('customer_id', currentAuthUser.id)
          .order('is_default', { ascending: false })
          .limit(1);

        if (savedAddresses && savedAddresses.length > 0 && isMounted) {
          const def = savedAddresses[0];
          setAddress({
            label: def.label || 'Home',
            line1: def.line1 || '',
            area: def.area || 'Oke-Ilewo',
            city: def.city || 'Abeokuta',
            instructions: def.instructions || '',
          });
        }
      } catch (err) {
        console.warn('Checkout: error loading saved address', err);
      } finally {
        if (isMounted) {
          clearTimeout(failsafeTimer);
          setLoadingAuth(false);
        }
      }
    }

    loadUserAndAddress();

    return () => {
      isMounted = false;
      clearTimeout(failsafeTimer);
    };
  }, [router]);

  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  async function handleCreateOrder() {
    if (!address.line1.trim()) {
      showToast('Please enter your street address for delivery', 'error');
      return;
    }
    if (!address.area.trim()) {
      showToast('Please specify your area / neighborhood in Abeokuta', 'error');
      return;
    }

    setSubmitting(true);
    setMessage('Connecting to secure order gateway…');

    try {
      const supabase = createClient();
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser?.email) {
        // Session expired or missing — bounce back to login
        router.replace('/login?next=' + encodeURIComponent('/checkout'));
        return;
      }

      const userEmail = currentUser.email;

      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          items: items.map((item) => ({
            productId: item.productId,
            qty: item.qty,
            merchantId: item.merchantId,
            priceKobo: item.priceKobo,
            name: item.name,
          })),
          email: userEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success || !data.orderGroupId) {
        const errorMsg = data.error || 'Unable to initialize payment gateway';
        setMessage(errorMsg);
        showToast(errorMsg, 'error');
        return;
      }

      setOrderGroupId(data.orderGroupId);
      setAccessCode(data.accessCode);
      setReference(data.reference);
      setMessage('Order initialized. Click below to pay securely with Paystack.');
      showToast('Order created! Please complete payment below.', 'success');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error processing checkout';
      setMessage(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (paymentSuccess) {
    return (
      <div className="container-x pt-32 pb-20">
        <div className="card p-12 text-center max-w-lg mx-auto bg-white shadow-xl">
          <div className="w-16 h-16 rounded-full bg-ok/10 text-ok grid place-items-center mx-auto mb-4">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="text-2xl font-black text-ink">Payment Confirmed!</h1>
          <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
            Your payment was successfully verified by our servers. The kitchens have been dispatched to begin preparation.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/account" className="btn-primary no-underline">
              View Active Orders
            </Link>
            <Link href="/stores" className="btn-secondary no-underline">
              Back to Stores
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show full-screen loader while auth is resolving
  if (loadingAuth) {
    return (
      <div className="container-x pt-32 pb-20">
        <div className="card p-12 text-center max-w-md mx-auto bg-white shadow-xl flex flex-col items-center justify-center min-h-[220px]">
          <LiquidWaveSpinner size="md" words={['Verifying your session…']} />
        </div>
      </div>
    );
  }

  return (
    <div className="container-x pt-28 pb-20">
      <div className="mb-6">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-500 hover:text-ink transition-colors no-underline"
        >
          <ArrowLeft size={14} />
          <span>Back to Cart</span>
        </Link>
      </div>

      <div className="pb-6 border-b border-line/80">
        <span className="eb">Secure Checkout</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
          Delivery Address &amp; Payment
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Orders are confirmed only after secure online payment via Paystack. Hand over your PIN once the food arrives.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="card mt-10 p-10 text-center max-w-md mx-auto">
          <p className="text-sm text-neutral-500">Your cart is empty.</p>
          <Link href="/stores" className="btn-primary mt-4 inline-block no-underline">
            Browse stores
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left Form: Delivery Address */}
          <div className="space-y-6">
            <section className="card p-6 shadow-sm border border-line bg-white">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-line/60">
                <MapPin size={18} className="text-brand-500" />
                <h2 className="font-extrabold text-lg text-ink">Delivery Address in Abeokuta</h2>
              </div>



              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">
                    Address Label
                  </label>
                  <input
                    className="input text-sm"
                    placeholder="e.g. Home, Office, Hostel"
                    value={address.label}
                    onChange={(e) => setAddress({ ...address, label: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">
                    Area / Neighborhood
                  </label>
                  <input
                    className="input text-sm"
                    placeholder="e.g. Oke-Ilewo, Kuto, Camp"
                    value={address.area}
                    onChange={(e) => setAddress({ ...address, area: e.target.value })}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-600 mb-1">
                    Street Address / Landmark
                  </label>
                  <input
                    className="input text-sm"
                    placeholder="e.g. 14 Lalubu Street, opposite First Bank"
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-600 mb-1">City</label>
                  <input
                    className="input text-sm bg-neutral-100 font-semibold"
                    value={address.city}
                    readOnly
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-600 mb-1">
                    Rider Delivery Instructions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    className="input text-sm"
                    placeholder="e.g. Call upon arrival at the security gate, black gate."
                    value={address.instructions}
                    onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                  />
                </div>
              </div>
            </section>

            {/* Handover Safety Notice */}
            <div className="p-4 rounded-2xl bg-soft border border-line flex items-center gap-3 text-xs text-neutral-600">
              <ShieldCheck size={20} className="text-brand-500 shrink-0" />
              <span>
                <strong>Vigil PIN Protection:</strong> You will receive a unique 4-digit PIN on confirmation. Riders do not carry cash; payment is 100% digital and escrowed until PIN verification.
              </span>
            </div>
          </div>

          {/* Right Column: Order Summary & Paystack Action */}
          <aside className="card h-fit p-6 shadow-md border border-line bg-white space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-line">
              <CreditCard size={18} className="text-brand-500" />
              <h3 className="font-extrabold text-lg text-ink">Order Items</h3>
            </div>

            {/* Kitchen breakdown */}
            <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
              {merchantGroups.map((group) => (
                <div key={group.merchantId} className="space-y-1.5 text-xs">
                  <div className="font-black text-ink">{group.merchantName}</div>
                  {group.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-neutral-600 py-0.5"
                    >
                      <span className="truncate pr-2">
                        {item.qty} × {item.name}
                      </span>
                      <span className="font-semibold shrink-0">
                        {formatKobo(item.priceKobo * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2.5 text-xs text-neutral-600 border-t border-line pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong className="text-ink">{formatKobo(subtotalKobo)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Estimated Delivery Fee</span>
                <strong className="text-ink">{formatKobo(estimatedDeliveryFeeKobo)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Platform Service Fee</span>
                <strong className="text-ink">{formatKobo(serviceFeeKobo)}</strong>
              </div>
              <div className="flex justify-between items-baseline text-base font-black text-ink pt-2 border-t border-line/60">
                <span>Total to Pay</span>
                <span className="text-xl text-brand-600">{formatKobo(totalKobo)}</span>
              </div>
            </div>

            {/* Payment Trigger Buttons */}
            <div>
              {!orderGroupId ? (
                <button
                  type="button"
                  onClick={handleCreateOrder}
                  disabled={submitting || !items.length}
                  className="btn-primary w-full py-3.5 shadow-md shadow-brand-500/20 disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <LiquidWaveSpinner size="sm" hideText />
                      <span>Initializing Paystack…</span>
                    </span>
                  ) : (
                    <span>Proceed to Paystack Payment</span>
                  )}
                </button>
              ) : (
                <div className="space-y-3">
                  <PaystackCheckoutButton
                    orderGroupId={orderGroupId}
                    accessCode={accessCode || undefined}
                    reference={reference || undefined}
                    email={user?.email || undefined}
                    amountKobo={totalKobo}
                    onPaid={() => {
                      clear();
                      setPaymentSuccess(true);
                      showToast('Payment verified successfully!', 'success');
                    }}
                  />
                  <p className="text-center text-xs text-ok font-bold">
                    Order created (#{orderGroupId.slice(0, 8)}). Complete popup above.
                  </p>
                </div>
              )}

              {message && <p className="mt-3 text-xs text-neutral-500 text-center">{message}</p>}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
