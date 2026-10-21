'use client';

export interface PaystackTransactionResult {
  reference: string;
  status?: string;
  trans?: string;
  message?: string;
}

export interface PaystackTriggerOptions {
  accessCode?: string;
  reference?: string;
  email?: string;
  amountKobo?: number;
  onSuccess?: (result: PaystackTransactionResult) => void;
  onCancel?: () => void;
  onError?: (error: unknown) => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void };
      resumeTransaction?: (
        accessCode: string,
        callbacks?: {
          onSuccess?: (response: unknown) => void;
          onCancel?: () => void;
          onError?: (error: unknown) => void;
        }
      ) => void;
    };
  }
}

export function loadPaystackInline(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return resolve();
    if (window.PaystackPop) return resolve();

    const existingScript = document.getElementById('paystack-inline-js');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () =>
        reject(new Error('Unable to load Paystack Inline script'))
      );
      return;
    }

    const script = document.createElement('script');
    script.id = 'paystack-inline-js';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to load Paystack Inline script'));
    document.body.appendChild(script);
  });
}

/**
 * Triggers the official Paystack inline popup modal.
 * Supports both access_code (server-initialized) and inline parameters.
 */
export async function triggerPaystackPayment(options: PaystackTriggerOptions): Promise<void> {
  await loadPaystackInline();

  const publicKey =
    process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
    'pk_test_7ef16ce64abad4df1942344e156961085fab7013';

  if (!window.PaystackPop) {
    throw new Error('Paystack Inline script failed to initialize');
  }

  // Strategy 1: If accessCode is available, use Paystack setup with access_code
  if (options.accessCode) {
    try {
      const handler = window.PaystackPop.setup({
        key: publicKey,
        access_code: options.accessCode,
        callback: (response: { reference?: string; trans?: string; status?: string }) => {
          const res: PaystackTransactionResult = {
            reference: response.reference || options.reference || '',
            status: response.status || 'success',
            trans: response.trans,
          };
          window.dispatchEvent(
            new CustomEvent('vigilxpress:paystack-popup-success', { detail: res })
          );
          options.onSuccess?.(res);
        },
        onClose: () => {
          window.dispatchEvent(new CustomEvent('vigilxpress:paystack-popup-cancel'));
          options.onCancel?.();
        },
      });

      if (handler && typeof handler.openIframe === 'function') {
        handler.openIframe();
        return;
      }
    } catch {
      // Fall through to resumeTransaction if available
    }

    if (typeof window.PaystackPop.resumeTransaction === 'function') {
      window.PaystackPop.resumeTransaction(options.accessCode, {
        onSuccess: (resp) => {
          const res = (resp as PaystackTransactionResult) || {
            reference: options.reference || '',
          };
          options.onSuccess?.(res);
        },
        onCancel: () => options.onCancel?.(),
        onError: (err) => options.onError?.(err),
      });
      return;
    }
  }

  const customerEmail = (options.email || '').trim();
  if (!customerEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    throw new Error('A valid email address is required to launch Paystack payment.');
  }

  // Strategy 2: Direct client inline setup with public key, email, amount, and reference
  const handler = window.PaystackPop.setup({
    key: publicKey,
    email: customerEmail,
    amount: options.amountKobo || 100000,
    ref: options.reference || `VX-${Date.now()}`,
    currency: 'NGN',
    callback: (response: { reference: string }) => {
      const res: PaystackTransactionResult = {
        reference: response.reference,
        status: 'success',
      };
      window.dispatchEvent(
        new CustomEvent('vigilxpress:paystack-popup-success', { detail: res })
      );
      options.onSuccess?.(res);
    },
    onClose: () => {
      window.dispatchEvent(new CustomEvent('vigilxpress:paystack-popup-cancel'));
      options.onCancel?.();
    },
  });

  handler.openIframe();
}

/**
 * Backward compatibility helper for openPaystackPopup(accessCode)
 */
export async function openPaystackPopup(accessCode: string) {
  return triggerPaystackPayment({ accessCode });
}
