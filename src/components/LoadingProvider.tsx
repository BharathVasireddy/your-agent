'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  navigateWith: (path: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const setLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const navigateWith = (path: string) => {
    setIsLoading(true);
    router.push(path);
    // Loading will be set to false when the page loads
    setTimeout(() => setIsLoading(false), 100);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, navigateWith }}>
      {children}
      
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
            <p className="text-sm text-zinc-600 font-medium">Loading...</p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}