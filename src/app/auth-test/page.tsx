import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-amplify';
import Link from 'next/link';

export default async function AuthTestPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Auth Test</h1>
        
        {session ? (
          <div className="space-y-4">
            <div className="text-green-600 text-center">✅ Authentication Working!</div>
            <div className="space-y-2">
              <p><strong>Name:</strong> {session.user?.name}</p>
              <p><strong>Email:</strong> {session.user?.email}</p>
              <p><strong>User ID:</strong> {(session.user as any)?.id}</p>
            </div>
            <div className="text-center">
              <Link href="/api/auth/signout" className="text-red-600 hover:underline">
                Sign Out
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-red-600 text-center">❌ Not Authenticated</div>
            <div className="text-center">
              <Link href="/api/auth/signin" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Sign In with Google
              </Link>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-600 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}