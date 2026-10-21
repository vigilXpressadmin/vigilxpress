import React from 'react';
import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    positive?: boolean;
  };
  caption?: string;
  className?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  caption,
  className = '',
}: StatCardProps) {
  return (
    <div
      className={`card relative overflow-hidden p-5 transition-all duration-200 hover:shadow-md hover:border-brand-500/30 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {label}
          </p>
          <p className="text-2xl font-extrabold text-ink tracking-tight">
            {value}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 grid place-items-center flex-none">
          <Icon size={20} className="text-brand-500" />
        </div>
      </div>

      {(trend || caption) && (
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-line/60 text-xs">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                trend.positive !== false ? 'text-ok' : 'text-red-600'
              }`}
            >
              {trend.positive !== false ? (
                <TrendingUp size={13} />
              ) : (
                <TrendingDown size={13} />
              )}
              {trend.value}
            </span>
          )}
          {caption && <span className="text-neutral-500">{caption}</span>}
        </div>
      )}
    </div>
  );
}

export default StatCard;
