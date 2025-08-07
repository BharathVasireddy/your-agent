import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getUserFlowStatus } from '@/lib/userFlow';
import AuthPageLayout from '@/components/auth/AuthPageLayout';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default async function ResetPasswordPage() {
  // Check if user is already signed in
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    // Check their flow status to determine where to redirect
    const flowStatus = await getUserFlowStatus();
    redirect(flowStatus.redirectTo);
  }

  return (
    <AuthPageLayout 
      title="Reset Password"
      subtitle="Enter your email to receive reset instructions"
      footerText="Remember your password?"
      footerLink="/login"
      footerLinkText="Sign in"
    >
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthPageLayout>
  );
}
