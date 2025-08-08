'use client';

import { useEffect } from 'react';
import { useEditMode } from './EditModeProvider';

interface ClientEditOnlyProps {
  children: React.ReactNode;
  selectorToHide?: string;
}

export default function ClientEditOnly({ children, selectorToHide }: ClientEditOnlyProps) {
  const { isOwner, isEditMode } = useEditMode();

  const shouldRender = isOwner && isEditMode;

  useEffect(() => {
    if (!shouldRender || !selectorToHide) return;
    const el = document.querySelector(selectorToHide) as HTMLElement | null;
    if (el) el.style.display = 'none';
    return () => {
      if (el) el.style.display = '';
    };
  }, [shouldRender, selectorToHide]);

  if (!shouldRender) return null;
  return <>{children}</>;
}


