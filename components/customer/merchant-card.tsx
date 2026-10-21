import Link from 'next/link';
import { Star, Clock, MapPin, Store } from 'lucide-react';
import type { MerchantSummary } from '@/lib/types';

// Vibrant brand gradient backgrounds for food/grocery banners
const GRADIENTS = [
  'from-orange-500/20 via-amber-500/15 to-brand-500/10',
  'from-emerald-500/20 via-teal-500/15 to-brand-500/10',
  'from-amber-500/25 via-orange-400/20 to-red-500/10',
  'from-purple-500/20 via-pink-500/15 to-orange-400/10',
];

export function MerchantCard({ merchant }: { merchant: MerchantSummary }) {
  const gradient = GRADIENTS[Math.abs(merchant.name.length) % GRADIENTS.length];

  return (
    <Link
      href={`/stores/${merchant.slug}`}
      className="card group relative flex flex-col justify-between p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 hover:border-brand-500/50 no-underline overflow-hidden"
    >
      <div>
        {/* Banner with ambient gradient & status badge */}
        <div className={`relative h-32 w-full rounded-2xl bg-gradient-to-br ${gradient} border border-black/5 p-3 flex flex-col justify-between overflow-hidden`}>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide bg-white/90 backdrop-blur-md text-ink shadow-sm">
              {merchant.category}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                merchant.isOpen !== false
                  ? 'bg-ok/15 text-ok border border-ok/30'
                  : 'bg-neutral-200 text-neutral-600'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${merchant.isOpen !== false ? 'bg-ok animate-pulse' : 'bg-neutral-400'}`} />
              {merchant.isOpen !== false ? 'Open' : 'Closed'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 self-start text-xs font-semibold px-2 py-1 rounded-lg bg-black/40 text-white backdrop-blur-md">
            <Store size={13} className="text-brand-400" />
            <span>Verified Kitchen</span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-ink text-lg leading-snug group-hover:text-brand-600 transition-colors">
              {merchant.name}
            </h3>
            <div className="flex items-center gap-1 text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              <span>{merchant.rating.toFixed(1)}</span>
            </div>
          </div>

          {merchant.description && (
            <p className="mt-1.5 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
              {merchant.description}
            </p>
          )}

          {merchant.tags && merchant.tags.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {merchant.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs text-neutral-500 font-medium">
        <span className="flex items-center gap-1 text-neutral-700 font-bold">
          <Clock size={13} className="text-brand-500" />
          {merchant.deliveryEta}
        </span>
        {merchant.area && (
          <span className="flex items-center gap-1 text-neutral-500">
            <MapPin size={12} className="text-neutral-400" />
            {merchant.area}
          </span>
        )}
      </div>
    </Link>
  );
}
