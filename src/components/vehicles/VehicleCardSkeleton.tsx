import { Skeleton } from '@/components/ui/skeleton';

export function VehicleCardSkeleton() {
  return (
    <div className="rounded-lg bg-card border border-border overflow-hidden">
      {/* Header */}
      <div className="p-3 pb-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Skeleton className="h-5 w-32" />
          <div className="flex flex-col gap-1 items-end">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-1.5 mb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      {/* Image */}
      <div className="mx-3">
        <Skeleton className="aspect-[16/10] w-full rounded-md" />
      </div>

      {/* View All Packages button */}
      <div className="flex justify-center py-3">
        <Skeleton className="h-8 w-28" />
      </div>

      {/* Content */}
      <div className="px-3 pb-3">
        {/* Specs */}
        <div className="flex items-center justify-center gap-3 border-t border-b border-border py-2 mb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>

        {/* Pickup Location */}
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-7 flex-1" />
        </div>

        {/* Pricing */}
        <div className="flex items-end justify-between gap-2">
          <div className="space-y-1">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-18" />
          </div>
          <Skeleton className="h-8 w-20" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    </div>
  );
}
