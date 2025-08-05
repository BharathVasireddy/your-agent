'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const EditableWrapper = dynamic(() => import('./EditableWrapper'), {
  ssr: false,
  loading: () => <></>,
});

interface ClientOnlyEditableWrapperProps {
  children: React.ReactNode;
  value: string;
  onSave: (newValue: string) => Promise<void>;
  type?: 'text' | 'textarea' | 'title' | 'subtitle';
  placeholder?: string;
  className?: string;
}

export default function ClientOnlyEditableWrapper(props: ClientOnlyEditableWrapperProps) {
  return <EditableWrapper {...props} />;
}