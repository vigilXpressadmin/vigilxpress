import Image from "next/image";
import { Check } from "lucide-react";

export interface OrderStep {
  id: string;
  label: string;
  status: "completed" | "current" | "pending";
}

const ORDER_STEPS: OrderStep[] = [
  { id: "payment", label: "Payment verified", status: "completed" },
  { id: "kitchen", label: "Kitchen accepted", status: "completed" },
  { id: "rider", label: "Rider picked up", status: "completed" },
  { id: "delivery", label: "Arriving in 6 min", status: "current" },
  { id: "handover", label: "Share your PIN", status: "pending" },
];

export default function OrderStatusCard() {
  return (
    <div
      className="relative w-full max-w-[420px] mx-auto rounded-2xl border border-white/10 bg-neutral-900/85 backdrop-blur-md shadow-2xl p-5 sm:p-6 overflow-hidden text-left"
      role="region"
      aria-label="Sample order tracking preview"
    >
      {/* Faint watermark brand logo behind card - decorative */}
      <div
        className="pointer-events-none absolute -right-8 -bottom-10 w-44 h-44 opacity-[0.06] select-none"
        aria-hidden="true"
      >
        <Image
          src="/assets/logo.png"
          alt=""
          width={176}
          height={176}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Header row: Live indicator + Sample order badge */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5 items-center justify-center" aria-hidden="true">
            <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500 motion-safe:animate-pulse" />
          </span>
          <span className="text-[11px] font-bold tracking-wider text-brand-400 uppercase">
            LIVE ORDER
          </span>
        </div>

        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-neutral-300 border border-white/10">
          Sample order
        </span>
      </div>

      {/* Order info */}
      <div className="mb-4">
        <p className="text-white font-bold text-base sm:text-[17px] tracking-tight">
          Order #4823 · Mama Risikat&apos;s
        </p>
      </div>

      {/* Vertical timeline */}
      <ol className="relative space-y-0 pl-1 m-0 list-none" aria-label="Order status timeline">
        {ORDER_STEPS.map((step, index) => {
          const isLast = index === ORDER_STEPS.length - 1;
          const isCompleted = step.status === "completed";
          const isCurrent = step.status === "current";

          return (
            <li key={step.id} className="relative flex items-start gap-3.5 pb-3 last:pb-0">
              {/* Connecting vertical line */}
              {!isLast && (
                <span
                  className={`absolute left-[9px] top-[18px] -bottom-[2px] w-[2px] ${
                    isCompleted ? "bg-emerald-500/40" : "bg-white/10"
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Status node */}
              <div className="relative z-10 flex-shrink-0 mt-0.5" aria-hidden="true">
                {isCompleted ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-ink ring-2 ring-emerald-500/30">
                    <Check size={12} strokeWidth={3} className="text-neutral-950" />
                  </span>
                ) : isCurrent ? (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-brand-500 text-ink shadow-[0_0_12px_rgba(255,107,26,0.7)] ring-2 ring-brand-400/40">
                    <span className="w-2 h-2 rounded-full bg-white motion-safe:animate-pulse" />
                  </span>
                ) : (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-neutral-600 bg-neutral-900" />
                )}
              </div>

              {/* Step label */}
              <div className="pt-0.5 min-w-0">
                <span
                  className={`text-sm ${
                    isCurrent
                      ? "text-white font-bold tracking-tight"
                      : isCompleted
                      ? "text-neutral-200 font-medium"
                      : "text-neutral-400 font-normal"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
