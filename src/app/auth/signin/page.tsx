import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import SignInForm from './SignInForm';

export default async function SignInPage() {
  // Check if user is already signed in
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    redirect('/agent/dashboard');
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-zinc-950">Welcome Back</h1>
          <p className="mt-2 text-zinc-600">Sign in to your agent dashboard</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white rounded-lg shadow-sm border border-zinc-200 p-8">
          <Suspense fallback={<div className="text-center">Loading...</div>}>
            <SignInForm />
          </Suspense>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-zinc-600">
            Don&apos;t have an account?{' '}
            <a href="/auth/register" className="text-red-600 hover:text-red-700 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}