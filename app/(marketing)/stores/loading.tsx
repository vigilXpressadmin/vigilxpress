import { Skeleton, SkeletonGrid } from '@/components/ui/skeleton';

export default function StoresLoading() {
  return (
    <div className="container-x py-20 space-y-8">
      {/* Page title skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton variant="text" lines={2} className="max-w-md" />
      </div>
      {/* Filter row */}
      <div className="flex gap-3 flex-wrap">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-full" />
        ))}
      </div>
      {/* Store cards grid */}
      <SkeletonGrid count={8} />
    </div>
  );
}
