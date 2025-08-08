import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="border border-zinc-200 rounded-lg p-4 bg-white">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-7 w-24" />
      </div>
    </div>
  );
}


