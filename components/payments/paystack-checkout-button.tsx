'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { triggerPaystackPayment, type PaystackTransactionResult } from '@/lib/payments/paystack-client';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';

interface PaystackCheckoutButtonProps {
  orderGroupId: string;
  accessCode?: string;
  reference?: string;
  email?: string;
  amountKobo?: number;
  onPaid?: () => void;
}

export function PaystackCheckoutButton({
  orderGroupId,
  accessCode: propAccessCode,
  reference: propReference,
  email,
  amountKobo,
  onPaid,
}: PaystackCheckoutButtonProps) {
  const [accessCode, setAccessCode] = useState(propAccessCode || '');
  const [reference, setReference] = useState(propReference || '');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [paid, setPaid] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (propAccessCode) setAccessCode(propAccessCode);
    if (propReference) setReference(propReference);
  }, [propAccessCode, propReference]);

  // If no accessCode is supplied, initialize with our backend API
  useEffect(() => {
    if (accessCode || !orderGroupId) return;

    let isMounted = true;
    async function initPayment() {
      try {
        const res = await fetch('/api/payments/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderGroupId,
            email,
            items: [{ productId: 'order-group', priceKobo: amountKobo || 100000, qty: 1 }],
          }),
        });
        const data = await res.json();
        if (data.success && isMounted) {
          setAccessCode(data.accessCode);
          setReference(data.reference);
        }
      } catch (err) {
        console.warn('PaystackCheckoutButton: init error', err);
      }
    }

    initPayment();
    return () => {
      isMounted = false;
    };
  }, [accessCode, orderGroupId, email, amountKobo]);

  const verifyPayment = async (txnReference: string) => {
    setVerifying(true);
    setMessage('Verifying payment with Paystack servers…');

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: txnReference,
          orderGroupId,
        }),
      });

      const data = await res.json();

      if (data.success && data.status === 'paid') {
        setPaid(true);
        setMessage('Payment confirmed! Order status updated to Paid.');
        showToast('Payment successful! Order confirmed.', 'success');
        onPaid?.();
      } else {
        setMessage(data.message || 'Payment verification pending. Please check order status.');
        showToast('Payment status: ' + (data.status || 'pending'), 'info');
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error verifying transaction';
      setMessage(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setVerifying(false);
      setLoading(false);
    }
  };

  const handlePay = async () => {
    setLoading(true);
    setMessage('Connecting to Paystack gateway…');

    try {
      // Authoritatively resolve email from props or active Supabase session
      let activeEmail = (email || '').trim();
      if (!activeEmail) {
        const supabase = createClient();
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();
        if (authUser?.email) {
          activeEmail = authUser.email.trim();
        }
      }

      if (!activeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(activeEmail)) {
        setLoading(false);
        setMessage('A valid email address is required for payment.');
        showToast('Please sign in with a valid email to complete payment', 'error');
        return;
      }

      setMessage('Opening Paystack checkout modal…');

      await triggerPaystackPayment({
        accessCode: accessCode || undefined,
        reference: reference || undefined,
        email: activeEmail,
        amountKobo: amountKobo || undefined,
        onSuccess: (result: PaystackTransactionResult) => {
          verifyPayment(result.reference || reference);
        },
        onCancel: () => {
          setLoading(false);
          setMessage('Transaction cancelled by user.');
        },
        onError: (err: unknown) => {
          setLoading(false);
          const errMsg = err instanceof Error ? err.message : 'Paystack modal error';
          setMessage(errMsg);
          showToast(errMsg, 'error');
        },
      });
    } catch (err: unknown) {
      setLoading(false);
      const errMsg = err instanceof Error ? err.message : 'Unable to launch Paystack popup';
      setMessage(errMsg);
      showToast(errMsg, 'error');
    }
  };

  if (paid) {
    return (
      <div className="p-4 rounded-2xl bg-ok/10 border border-ok/30 text-ok text-center space-y-1">
        <CheckCircle2 size={24} className="mx-auto text-ok" />
        <p className="text-sm font-extrabold">Payment Complete</p>
        <p className="text-xs text-neutral-600">Your order is now being processed.</p>
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-2.5">
      <button
        type="button"
        disabled={loading || verifying}
        onClick={handlePay}
        className="btn-primary w-full py-3.5 shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 text-sm font-black disabled:opacity-50"
      >
        {loading || verifying ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>{verifying ? 'Verifying payment…' : 'Connecting to Paystack…'}</span>
          </>
        ) : (
          <>
            <CreditCard size={16} />
            <span>Pay with Paystack (Test Mode)</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
        <ShieldCheck size={13} className="text-ok" />
        <span>Secured 256-bit payment by Paystack</span>
      </div>

      {message && (
        <p className="text-center text-xs text-neutral-600 bg-neutral-100 p-2 rounded-lg">
          {message}
        </p>
      )}
    </div>
  );
}
