import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { getUserFlowStatus } from '@/lib/userFlow';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import SignUpForm from '@/components/SignUpForm';

export default async function RegisterPage() {
  // Check if user is already signed in
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    // Check their flow status to determine where to redirect
    const flowStatus = await getUserFlowStatus();
    redirect(flowStatus.redirectTo);
  }

  return (
    <AuthPageLayout 
      title="Create Your Account"
      subtitle="Join thousands of real estate agents"
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Sign in"
    >
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <SignUpForm />
      </Suspense>
    </AuthPageLayout>
  );
}
