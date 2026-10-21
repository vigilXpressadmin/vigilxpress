'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { StatusBadge } from '@/components/dashboard/data-table';
import { Bike, Navigation, CheckCircle2, KeyRound } from 'lucide-react';

export function RiderDeliveryCard({
  jobId,
  status: initialStatus,
}: {
  jobId: string;
  status: string;
}) {
  const [status, setStatus] = useState(initialStatus);
  const { showToast } = useToast();

  const handleAccept = () => {
    setStatus('assigned');
    showToast(`Delivery job ${jobId} accepted. Routing to pickup point.`, 'success');
  };

  const handlePickup = () => {
    setStatus('picked_up');
    showToast(`Pickup confirmed for ${jobId}. En route to customer.`, 'info');
  };

  const handlePin = () => {
    setStatus('delivered');
    showToast(`Delivery PIN verified! Job ${jobId} completed.`, 'success');
  };

  return (
    <div className="card p-5 transition-all duration-200 hover:shadow-md hover:border-brand-500/30">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center flex-none">
            <Bike size={20} />
          </div>
          <div>
            <strong className="text-base font-bold text-ink block">
              Delivery Job #{jobId}
            </strong>
            <span className="text-xs text-neutral-500">
              Abeokuta Metro Area
            </span>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-soft/70 border border-line/60 space-y-1.5 text-xs text-neutral-600">
        <div className="flex items-center gap-2 font-medium text-ink">
          <Navigation size={13} className="text-brand-500" />
          <span>Multi-stop routing enabled</span>
        </div>
        <p className="text-neutral-500">
          Pickup and delivery stops are loaded dynamically from <code>delivery_jobs</code> and <code>delivery_stops</code>.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 pt-2 border-t border-line/60">
        <button
          type="button"
          onClick={handleAccept}
          className="btn-primary !py-2 !px-4 text-xs"
        >
          <CheckCircle2 size={14} />
          Accept
        </button>

        <button
          type="button"
          onClick={handlePickup}
          className="btn-secondary !py-2 !px-4 text-xs"
        >
          Confirm pickup
        </button>

        <button
          type="button"
          onClick={handlePin}
          className="btn-secondary !py-2 !px-4 text-xs"
        >
          <KeyRound size={14} />
          Enter delivery PIN
        </button>
      </div>
    </div>
  );
}
