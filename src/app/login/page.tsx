import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getUserFlowStatus } from '@/lib/userFlow';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import SignInForm from '@/components/SignInForm';

export default async function LoginPage() {
  // Check if user is already signed in
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    // Check their flow status to determine where to redirect
    const flowStatus = await getUserFlowStatus();
    // If session is valid and authenticated, follow the flow
    if (flowStatus.isAuthenticated) {
      redirect(flowStatus.redirectTo);
    }
    // Orphaned/invalid session: force sign-out to break loops
    redirect('/api/auth/signout?callbackUrl=/login?error=session_expired');
  }

  return (
    <AuthPageLayout 
      title="Welcome Back"
      subtitle="Sign in with Google or WhatsApp"
    >
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <SignInForm />
      </Suspense>
    </AuthPageLayout>
  );
}
