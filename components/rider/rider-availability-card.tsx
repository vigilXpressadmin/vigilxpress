'use client';

import React, { useState, useEffect } from 'react';
import { Bike, Power, Radio, ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';

export function RiderAvailabilityCard() {
  const [online, setOnline] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    let isMounted = true;
    async function loadRiderStatus() {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && isMounted) {
          const { data: rider } = await supabase
            .from('riders')
            .select('is_online')
            .eq('user_id', user.id)
            .maybeSingle();

          if (rider && isMounted) {
            setOnline(rider.is_online ?? false);
          }
        }
      } catch (err) {
        console.warn('RiderAvailabilityCard: error loading status', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRiderStatus();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggle = async () => {
    const next = !online;
    setUpdating(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase
          .from('riders')
          .update({ is_online: next })
          .eq('user_id', user.id);
      }

      setOnline(next);
      showToast(
        next
          ? 'You are now ONLINE. System will route nearby delivery jobs to you.'
          : 'You are now OFFLINE. Delivery dispatch paused.',
        next ? 'success' : 'info'
      );
    } catch (err) {
      console.warn('Error updating rider online status', err);
      setOnline(next); // Optimistic fallback
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="card p-6 relative overflow-hidden transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-ink">Dispatch Status</h2>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                online
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : 'bg-neutral-100 text-neutral-600 border-neutral-200'
              }`}
            >
              <Radio
                size={12}
                className={online ? 'text-ok animate-pulse' : 'text-neutral-400'}
              />
              {online ? 'Online & Receiving Jobs' : 'Offline'}
            </span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Only approved and verified riders can toggle status and receive batch delivery assignments.
          </p>
        </div>

        <div
          className={`w-12 h-12 rounded-2xl grid place-items-center transition-colors flex-none ${
            online
              ? 'bg-ok/10 text-ok border border-ok/20'
              : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
          }`}
        >
          <Bike size={24} />
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-line/60">
        <button
          type="button"
          onClick={handleToggle}
          disabled={updating}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${
            online
              ? 'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 border border-neutral-300'
              : 'bg-brand-500 text-ink hover:bg-brand-400 shadow-md shadow-brand-500/20'
          }`}
        >
          {updating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Power size={16} />
          )}
          <span>{online ? 'Go offline' : 'Go online now'}</span>
        </button>

        <span className="text-xs text-neutral-500 flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-ok" />
          GPS tracking active when online
        </span>
      </div>
    </div>
  );
}
