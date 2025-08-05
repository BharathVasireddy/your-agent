import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Icon/Number */}
        <div className="space-y-4">
          <div className="text-6xl font-bold text-red-600">404</div>
          <h1 className="text-3xl font-bold text-zinc-950">Page Not Found</h1>
          <p className="text-zinc-600 text-lg">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Search-like illustration */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-zinc-300 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-zinc-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-1 bg-zinc-300 rotate-45 rounded-full"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="border-zinc-300 text-zinc-700 hover:bg-zinc-50">
              <Link href="javascript:history.back()">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-zinc-500">
            Or try searching for what you&apos;re looking for from our{' '}
            <Link href="/" className="text-red-600 hover:text-red-700 font-medium">
              homepage
            </Link>
          </p>
        </div>

        {/* Help Section */}
        <div className="pt-8 border-t border-zinc-200">
          <h3 className="text-lg font-semibold text-zinc-950 mb-3">Need Help?</h3>
          <div className="space-y-2 text-sm text-zinc-600">
            <p>• Check if the URL is spelled correctly</p>
            <p>• Try refreshing the page</p>
            <p>• Contact support if the problem persists</p>
          </div>
        </div>
      </div>
    </div>
  );
}