import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserFlowStatus } from '@/lib/userFlow';
import TestPaymentPage from './TestPaymentPage';

export default async function TestPaymentPageWrapper() {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    redirect('/subscribe');
  }

  // Check authentication
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  // Check user flow status
  const flowStatus = await getUserFlowStatus();
  
  // If user is already subscribed, redirect them
  if (!flowStatus.needsSubscription) {
    if (flowStatus.needsOnboarding) {
      redirect('/onboarding/wizard');
    } else {
      redirect('/agent/dashboard');
    }
  }

  return <TestPaymentPage session={session} flowStatus={flowStatus} />;
}