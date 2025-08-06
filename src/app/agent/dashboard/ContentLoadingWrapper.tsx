'use client';

import { useInstantNav } from '@/components/InstantNavProvider';

interface ContentLoadingWrapperProps {
  children: React.ReactNode;
}

export default function ContentLoadingWrapper({ children }: ContentLoadingWrapperProps) {
  const { isContentLoading } = useInstantNav();

  // Use a smooth transition overlay instead of replacing content
  return (
    <div className="relative">
      {/* Actual content with smooth transition */}
      <div className={`transition-opacity duration-200 ${isContentLoading ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
        {children}
      </div>

      {/* Overlay skeleton when loading with fade-in */}
      {isContentLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center animate-in fade-in duration-200">
          <div className="space-y-4 md:space-y-6 w-full max-w-4xl mx-auto p-4">
            {/* Subtle loading indicator */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-sm text-zinc-600">Loading...</span>
            </div>

            {/* Lightweight skeleton overlay */}
            <div className="flex items-center justify-between animate-pulse">
              <div className="space-y-2">
                <div className="h-6 bg-zinc-200 rounded w-48"></div>
                <div className="h-3 bg-zinc-200 rounded w-32"></div>
              </div>
              <div className="h-8 bg-zinc-200 rounded w-24"></div>
            </div>

            {/* Simple content skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
              <div className="h-20 bg-zinc-200 rounded"></div>
              <div className="h-20 bg-zinc-200 rounded"></div>
              <div className="h-20 bg-zinc-200 rounded"></div>
            </div>

            <div className="h-48 bg-zinc-200 rounded animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}