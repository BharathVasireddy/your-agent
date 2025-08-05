import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function NewPropertyPage() {
  // Get the current user's session
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="container mx-auto p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            href="/agent/dashboard/properties"
            className="inline-flex items-center text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Properties
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-zinc-950">Add New Property</h1>
        <p className="text-zinc-600 mt-1">Create a new property listing</p>
      </div>

      {/* Placeholder Content */}
      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow-md border border-zinc-200 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H9m0 0H5m0 0h2M7 7h10M7 11h4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-950 mb-2">
            Property Form Coming Soon
          </h2>
          <p className="text-zinc-600 mb-6">
            This page will contain the form to add new properties to your listings.
          </p>
          <Link
            href="/agent/dashboard/properties"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Properties
          </Link>
        </div>
      </div>
    </div>
  );
}