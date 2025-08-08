'use client';

import dynamic from 'next/dynamic';

// Lazy-load the Toaster on the client only
const Toaster = dynamic(() => import('react-hot-toast').then(m => m.Toaster), {
  ssr: false,
});

export default function ToasterClient() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#374151',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 500,
        },
        success: {
          style: {
            border: '1px solid #10b981',
            background: '#f0fdf4',
            color: '#059669',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#ffffff',
          },
        },
        error: {
          style: {
            border: '1px solid #ef4444',
            background: '#fef2f2',
            color: '#dc2626',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}


