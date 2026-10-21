import React from 'react';
import { type LucideIcon, Clock } from 'lucide-react';

export interface ActivityItem {
  id: string;
  icon?: LucideIcon;
  title: string;
  time: string;
  description?: string;
  badge?: {
    label: string;
    variant?: 'success' | 'warning' | 'brand' | 'neutral';
  };
}

interface ActivityFeedProps {
  title?: string;
  items: ActivityItem[];
  emptyMessage?: string;
  className?: string;
}

export function ActivityFeed({
  title = 'Recent Activity',
  items,
  emptyMessage = 'No recent activity recorded yet.',
  className = '',
}: ActivityFeedProps) {
  const badgeStyles = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    brand: 'bg-brand-50 text-brand-700 border-brand-200',
    neutral: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  };

  return (
    <div className={`card p-6 ${className}`}>
      {title && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-line">
          <h2 className="text-base font-bold text-ink">{title}</h2>
          <span className="text-xs text-neutral-400 font-medium">Live Feed</span>
        </div>
      )}

      {items.length === 0 ? (
        <div className="py-8 text-center text-sm text-neutral-500">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => {
            const Icon = item.icon || Clock;
            const isLast = index === items.length - 1;

            return (
              <div key={item.id} className="relative flex items-start gap-3.5">
                {/* Connecting line */}
                {!isLast && (
                  <div className="absolute left-[17px] top-9 bottom-[-16px] w-[2px] bg-line" />
                )}

                {/* Icon circle */}
                <div className="relative z-10 w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-500 grid place-items-center flex-none">
                  <Icon size={16} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-semibold text-ink truncate">
                      {item.title}
                    </p>
                    <span className="text-[11px] font-medium text-neutral-400 whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>

                  {item.description && (
                    <p className="mt-1 text-xs text-neutral-600 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  {item.badge && (
                    <div className="mt-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          badgeStyles[item.badge.variant || 'neutral']
                        }`}
                      >
                        {item.badge.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ActivityFeed;
