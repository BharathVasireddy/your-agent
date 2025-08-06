'use client';

import { lazy, Suspense } from 'react';
import { useSession } from 'next-auth/react';

// Lazy load editing components only when needed
const EditModeProvider = lazy(() => import('./EditModeProvider').then(module => ({ default: module.EditModeProvider })));
const EditToggleButton = lazy(() => import('./EditToggleButton'));

interface LazyEditProviderProps {
  children: React.ReactNode;
  isOwner: boolean;
}

export default function LazyEditProvider({ children, isOwner }: LazyEditProviderProps) {
  const { status } = useSession();
  
  // Don't load editing components if user is not the owner
  if (!isOwner || status === 'loading') {
    return <>{children}</>;
  }

  // Only load editing functionality when needed
  return (
    <Suspense fallback={<>{children}</>}>
      <EditModeProvider isOwner={isOwner}>
        {children}
        <EditToggleButton />
      </EditModeProvider>
    </Suspense>
  );
}