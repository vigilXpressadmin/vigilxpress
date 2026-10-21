import { cn } from '@/lib/utils';

type SkeletonVariant = 'default' | 'card' | 'text' | 'avatar';

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
  lines?: number; // only used for 'text' variant
}

export function Skeleton({ variant = 'default', className, lines = 3 }: SkeletonProps) {
  if (variant === 'text') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'animate-pulse rounded-lg bg-line h-4',
              i === lines - 1 && 'w-3/4'
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === 'avatar') {
    return (
      <div
        className={cn(
          'animate-pulse rounded-full bg-line flex-none',
          'w-10 h-10',
          className
        )}
      />
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('animate-pulse rounded-2xl bg-line/60 border border-line p-6 space-y-3', className)}>
        <div className="h-5 bg-line rounded-lg w-2/5" />
        <div className="h-4 bg-line rounded-lg w-full" />
        <div className="h-4 bg-line rounded-lg w-5/6" />
        <div className="h-4 bg-line rounded-lg w-3/4" />
      </div>
    );
  }

  // default — simple block
  return (
    <div
      className={cn('animate-pulse rounded-xl bg-line', className)}
    />
  );
}

/** Convenience: a row of N skeleton cards in a CSS grid */
export function SkeletonGrid({ count = 4, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('grid gap-4', className)} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px,1fr))' }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </div>
  );
}
