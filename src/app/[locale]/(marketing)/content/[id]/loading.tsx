import { AudioPlayerSkeleton, Skeleton } from '@/components/ui/skeleton';

export default function ContentDetailLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 pb-32 md:px-6 lg:px-8">
      {/* Hero image */}
      <Skeleton variant="card" className="mb-6 aspect-video w-full" />

      {/* Category badge */}
      <Skeleton variant="button" className="mb-4 h-6 w-24" />

      {/* Title */}
      <div className="mb-6 space-y-3">
        <Skeleton variant="text" className="h-8 w-3/4" />
        <Skeleton variant="text" className="h-8 w-1/2" />
      </div>

      {/* Body text */}
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            className={i % 3 === 2 ? 'w-4/6' : i % 3 === 1 ? 'w-5/6' : 'w-full'}
          />
        ))}
      </div>

      {/* Fixed bottom audio player */}
      <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-black/90 p-4">
        <div className="mx-auto max-w-4xl">
          <AudioPlayerSkeleton />
        </div>
      </div>
    </div>
  );
}
