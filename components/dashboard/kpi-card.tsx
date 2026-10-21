'use client';

import React from 'react';
import { type LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: 'solid' | 'glass';
  subtitle?: string;
  trend?: {
    value: string;
    positive?: boolean;
  };
  className?: string;
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  variant = 'glass',
  subtitle,
  trend,
  className = '',
}: KpiCardProps) {
  if (variant === 'solid') {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl bg-brand-500 text-ink p-6 shadow-lg shadow-brand-500/20 transition-all duration-200 hover:scale-[1.01] ${className}`}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/75">
            {title}
          </p>
          <div className="w-10 h-10 rounded-xl bg-ink/10 grid place-items-center">
            <Icon size={20} className="text-ink" />
          </div>
        </div>

        <div className="mt-3">
          <p className="text-3xl font-extrabold tracking-tight text-ink">
            {value}
          </p>
          {(subtitle || trend) && (
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-ink/80">
              {trend && (
                <span className="inline-flex items-center gap-1 font-bold">
                  {trend.positive !== false ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {trend.value}
                </span>
              )}
              {subtitle && <span>{subtitle}</span>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Variant: 'glass'
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-line bg-white/80 backdrop-blur-xl p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-brand-500/30 ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          {title}
        </p>
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 grid place-items-center">
          <Icon size={20} className="text-brand-500" />
        </div>
      </div>

      <div className="mt-3">
        <p className="text-3xl font-extrabold tracking-tight text-ink">
          {value}
        </p>
        {(subtitle || trend) && (
          <div className="mt-2 flex items-center gap-2 text-xs">
            {trend && (
              <span
                className={`inline-flex items-center gap-1 font-bold ${
                  trend.positive !== false ? 'text-ok' : 'text-red-600'
                }`}
              >
                {trend.positive !== false ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {trend.value}
              </span>
            )}
            {subtitle && <span className="text-neutral-500">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

export default KpiCard;
