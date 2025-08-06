'use client';

import { useInstantNav } from '@/components/InstantNavProvider';

interface ContentLoadingWrapperProps {
  children: React.ReactNode;
}

export default function ContentLoadingWrapper({ children }: ContentLoadingWrapperProps) {
  const { isContentLoading } = useInstantNav();

  // Big-company approach: NO skeleton, NO overlay - just a subtle top-right indicator
  return (
    <div className="relative">
      {/* Subtle loading indicator in top-right corner like GitHub/Linear */}
      {isContentLoading && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white border border-zinc-200 rounded-full px-3 py-1.5 shadow-lg flex items-center space-x-2">
            <div className="w-3 h-3 border border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-zinc-600 font-medium">Loading</span>
          </div>
        </div>
      )}

      {/* Content with very subtle opacity change - barely noticeable */}
      <div className={`transition-opacity duration-75 ${isContentLoading ? 'opacity-95' : 'opacity-100'}`}>
        {children}
      </div>
    </div>
  );
}