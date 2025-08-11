'use client';

import { Loader2 } from 'lucide-react';

interface PageLoaderProps {
  message?: string;
}

export function PageLoader({ message = "Loading..." }: PageLoaderProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] md:min-h-[500px]">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="w-8 h-8 text-brand animate-spin" />
        <p className="text-sm text-zinc-600 font-medium">{message}</p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-zinc-200 rounded w-3/4"></div>
        <div className="h-8 bg-zinc-200 rounded w-1/2"></div>
        <div className="h-3 bg-zinc-200 rounded w-full"></div>
        <div className="h-3 bg-zinc-200 rounded w-2/3"></div>
      </div>
    </div>
  );
}

export function KPISkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border border-zinc-200 p-4 md:p-6 animate-pulse">
          <div className="space-y-3">
            <div className="h-6 w-6 bg-zinc-200 rounded"></div>
            <div className="h-8 bg-zinc-200 rounded w-3/4"></div>
            <div className="h-3 bg-zinc-200 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}