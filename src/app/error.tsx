'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Route error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-zinc-950">Oops! Something went wrong</h1>
          <p className="text-zinc-600 text-lg">
            We&apos;re experiencing some technical difficulties. Please try again or contact support if the problem persists.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={reset}
              className="bg-brand hover:bg-brand-hover text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button asChild variant="outline" className="border-zinc-300 text-zinc-700 hover:bg-zinc-50">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-zinc-500">
            Error ID: {error.digest || 'Unknown'}
          </p>
        </div>

        {/* Help Section */}
        <div className="pt-8 border-t border-zinc-200">
          <h3 className="text-lg font-semibold text-zinc-950 mb-3">Quick fixes to try:</h3>
          <div className="space-y-2 text-sm text-zinc-600">
            <p>• Refresh the page</p>
            <p>• Clear your browser cache</p>
            <p>• Try again in a few minutes</p>
            <p>• Contact support if the issue continues</p>
          </div>
        </div>
      </div>
    </div>
  );
}