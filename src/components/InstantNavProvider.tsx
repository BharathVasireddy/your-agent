'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface InstantNavContextType {
  isContentLoading: boolean;
  pendingPath: string | null;
  navigateInstantly: (path: string) => void;
}

const InstantNavContext = createContext<InstantNavContextType | undefined>(undefined);

export function InstantNavProvider({ children }: { children: ReactNode }) {
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const navigateInstantly = (path: string) => {
    // Don't navigate if already on the same path
    if (path === pathname) return;
    
    // Immediately set the pending path (this updates active states)
    setPendingPath(path);
    setIsContentLoading(true);
    
    // Navigate in the background
    router.push(path);
    
    // Reset state after navigation
    setTimeout(() => {
      setPendingPath(null);
      setIsContentLoading(false);
    }, 100);
  };

  return (
    <InstantNavContext.Provider value={{ 
      isContentLoading, 
      pendingPath, 
      navigateInstantly 
    }}>
      {children}
    </InstantNavContext.Provider>
  );
}

export function useInstantNav() {
  const context = useContext(InstantNavContext);
  if (context === undefined) {
    throw new Error('useInstantNav must be used within an InstantNavProvider');
  }
  return context;
}