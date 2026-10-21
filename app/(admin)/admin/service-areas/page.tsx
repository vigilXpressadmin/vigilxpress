import React from 'react';
import { MapPin, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Service Areas & Zones',
};

export default function ServiceAreasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Delivery Service Areas
        </h1>
        <p className="mt-1 text-sm text-neutral-600">
          Configure cities, neighbourhoods, delivery zones and availability without hardcoding launch geography.
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 grid place-items-center">
            <MapPin size={20} />
          </div>
          <div>
            <h2 className="font-bold text-ink">Active Clusters: Ogun State Communities</h2>
            <p className="text-xs text-neutral-500">Currently active dispatch zones</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {['Sagamu', 'Ilishan', 'Iperu', 'Ikenne', 'Aiyepe', 'Odogbolu'].map((zone) => (
            <div key={zone} className="flex items-center gap-2 p-3 rounded-xl bg-soft/70 border border-line text-xs font-semibold text-ink">
              <CheckCircle2 size={15} className="text-ok flex-none" />
              <span>{zone}</span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-line">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Planned Expansion Corridors</h3>
          <div className="flex flex-wrap gap-2">
            {['Abeokuta Metro & Corridors', 'Future Ogun State Zones'].map((zone) => (
              <span key={zone} className="px-3 py-1 rounded-lg bg-soft border border-line text-xs text-neutral-600">
                ⏳ {zone}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
