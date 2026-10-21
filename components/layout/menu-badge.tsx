'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface MenuBadgeProps {
  count?: number | null;
  className?: string;
}

/**
 * Isolated memoized badge component for profile menu items.
 * Renders only when count > 0, preventing unnecessary re-renders of the navbar.
 */
export const MenuBadge = React.memo(function MenuBadge({
  count,
  className,
}: MenuBadgeProps) {
  if (!count || count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count;

  return (
    <span
      aria-label={`${count} items`}
      className={cn(
        'ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-extrabold leading-none',
        'bg-brand-500 text-ink shadow-sm ring-1 ring-brand-600/30',
        'transition-transform duration-150',
        className
      )}
    >
      {displayCount}
    </span>
  );
});
