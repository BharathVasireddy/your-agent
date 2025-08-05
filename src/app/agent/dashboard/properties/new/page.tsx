import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PropertyFormWrapper from '@/components/PropertyFormWrapper';

export default async function NewPropertyPage() {
  // Get the current user's session
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto p-6">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/agent/dashboard/properties"
              className="inline-flex items-center text-zinc-600 hover:text-zinc-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Properties
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-zinc-950">Add New Property</h1>
          <p className="text-zinc-600 mt-1">Create a new property listing for your portfolio</p>
        </div>

        {/* Property Form */}
        <PropertyFormWrapper />
      </div>
    </div>
  );
}