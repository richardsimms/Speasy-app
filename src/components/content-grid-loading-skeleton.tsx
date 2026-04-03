'use client';

import { ContentCardSkeleton, Skeleton } from '@/components/ui/skeleton';

const TAB_WIDTHS = ['w-14', 'w-16', 'w-20', 'w-18'] as const;

export function ContentGridLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      {/* Tab row */}
      <div className="mb-8 flex gap-2">
        {TAB_WIDTHS.map(width => (
          <Skeleton key={width} variant="button" className={`h-9 ${width}`} />
        ))}
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ContentCardSkeleton key={i} index={i} />
        ))}
      </div>
    </div>
  );
}
