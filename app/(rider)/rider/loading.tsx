import { Skeleton } from '@/components/ui/skeleton';

export default function RiderLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-44" />
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Availability Status Card Skeleton */}
      <div className="card p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-10 rounded-xl" />
        </div>
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-11 w-44 rounded-xl" />
      </div>

      {/* Chart Skeleton */}
      <div className="card p-6 space-y-4">
        <Skeleton className="h-5 w-52" />
        <Skeleton className="h-[240px] w-full rounded-xl" />
      </div>
    </div>
  );
}
