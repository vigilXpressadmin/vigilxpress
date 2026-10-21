'use client';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Variant config ───────────────────────────────────────────────────────────
const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: React.ReactNode; bar: string; bg: string; text: string }
> = {
  success: {
    icon: <CheckCircle size={18} />,
    bar: 'bg-green-500',
    bg: 'bg-[#0f2318] border-green-500/30',
    text: 'text-green-400',
  },
  error: {
    icon: <XCircle size={18} />,
    bar: 'bg-red-500',
    bg: 'bg-[#220f0f] border-red-500/30',
    text: 'text-red-400',
  },
  warning: {
    icon: <AlertTriangle size={18} />,
    bar: 'bg-amber-400',
    bg: 'bg-[#221a0a] border-amber-400/30',
    text: 'text-amber-300',
  },
  info: {
    icon: <Info size={18} />,
    bar: 'bg-brand-500',
    bg: 'bg-[#1a100a] border-brand-500/30',
    text: 'text-brand-400',
  },
};

// ─── Single Toast item ────────────────────────────────────────────────────────
function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const cfg = VARIANT_CONFIG[toast.variant];
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => onDismiss(toast.id), 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.94 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      role="alert"
      aria-live="assertive"
      className={`relative flex items-start gap-3 w-full max-w-sm rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-xl overflow-hidden ${cfg.bg}`}
    >
      {/* Accent bar */}
      <span className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${cfg.bar}`} />
      {/* Icon */}
      <span className={`mt-0.5 flex-none ${cfg.text}`}>{cfg.icon}</span>
      {/* Message */}
      <p className="flex-1 text-[14px] font-medium text-white/90 leading-snug">
        {toast.message}
      </p>
      {/* Dismiss */}
      <button
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="flex-none mt-0.5 text-white/40 hover:text-white/80 transition-colors"
      >
        <X size={15} />
      </button>
    </motion.div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  // SSR-safe: only create portal after mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
    },
    []
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const portalContent = (
    <div
      aria-label="Notifications"
      className="fixed bottom-5 right-5 z-[9999] flex flex-col items-end gap-2.5 pointer-events-none"
      style={{ maxWidth: 'calc(100vw - 40px)' }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto w-full max-w-sm">
            <ToastItem toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {mounted && createPortal(portalContent, document.body)}
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }
  return ctx;
}
