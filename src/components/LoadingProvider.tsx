'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

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
    // Very brief loading indicator
    setIsLoading(true);
    
    // Use requestAnimationFrame for smoother transition
    requestAnimationFrame(() => {
      router.push(path);
      
      // Quick reset to avoid flicker
      setTimeout(() => setIsLoading(false), 50);
    });
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, navigateWith }}>
      {children}
      

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