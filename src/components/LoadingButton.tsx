'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useLoading } from './LoadingProvider';

interface LoadingButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  loadingText?: string;
}

export function LoadingButton({ 
  href, 
  className = '', 
  children, 
  loadingText = 'Loading...' 
}: LoadingButtonProps) {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const { navigateWith } = useLoading();

  const handleClick = async () => {
    setIsButtonLoading(true);
    navigateWith(href);
    // Reset after a short delay
    setTimeout(() => setIsButtonLoading(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isButtonLoading}
      className={`${className} ${isButtonLoading ? 'opacity-75 cursor-not-allowed' : ''} transition-opacity`}
    >
      {isButtonLoading ? (
        <div className="flex items-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}