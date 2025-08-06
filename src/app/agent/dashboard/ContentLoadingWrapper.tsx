'use client';

import { useInstantNav } from '@/components/InstantNavProvider';
import { KPISkeleton, SkeletonCard } from '@/components/PageLoader';

interface ContentLoadingWrapperProps {
  children: React.ReactNode;
}

export default function ContentLoadingWrapper({ children }: ContentLoadingWrapperProps) {
  const { isContentLoading } = useInstantNav();

  if (isContentLoading) {
    return (
      <div className="space-y-4 md:space-y-6 animate-pulse">
        {/* Page Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-zinc-200 rounded w-48"></div>
            <div className="h-4 bg-zinc-200 rounded w-32"></div>
          </div>
          <div className="h-10 bg-zinc-200 rounded w-32"></div>
        </div>

        {/* KPI Cards Skeleton */}
        <KPISkeleton />

        {/* Content Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}