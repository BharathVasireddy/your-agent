'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-8">
            {/* Error Icon */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-brand" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-zinc-950">Something went wrong!</h1>
              <p className="text-zinc-600 text-lg">
                We encountered an unexpected error. This has been logged and we&apos;ll look into it.
              </p>
            </div>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-brand-light border border-brand-soft rounded-lg p-4 text-left">
                <h3 className="font-semibold text-brand-deep mb-2">Error Details:</h3>
                <pre className="text-xs text-brand-deep overflow-x-auto">
                  {error.message}
                </pre>
                {error.digest && (
                  <p className="text-xs text-brand mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}

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
                If this problem continues, please contact our support team.
              </p>
            </div>

            {/* Help Section */}
            <div className="pt-8 border-t border-zinc-200">
              <h3 className="text-lg font-semibold text-zinc-950 mb-3">What can you do?</h3>
              <div className="space-y-2 text-sm text-zinc-600">
                <p>• Try refreshing the page</p>
                <p>• Check your internet connection</p>
                <p>• Clear your browser cache</p>
                <p>• Contact support if the issue persists</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}