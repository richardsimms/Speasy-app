import { ListItemSkeleton, Skeleton } from '@/components/ui/skeleton';

export default function BlogLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Title skeleton — matches font-serif text-5xl h1 */}
        <div className="mb-12">
          <Skeleton variant="default" className="h-12 w-48 rounded-lg" />
        </div>

        {/* Blog post list */}
        <div className="mx-0 max-w-3xl divide-y divide-white/10">
          {Array.from({ length: 5 }).map((_, i) => (
            <ListItemSkeleton key={i} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
