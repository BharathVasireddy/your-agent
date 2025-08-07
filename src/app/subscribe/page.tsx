import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserFlowStatus } from '@/lib/userFlow';
import SubscriptionPage from './SubscriptionPage';

export default async function SubscribePage() {
  // Check authentication
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  // Check user flow status
  const flowStatus = await getUserFlowStatus();
  
  // If user is already subscribed, redirect them based on onboarding status
  if (!flowStatus.needsSubscription) {
    if (flowStatus.needsOnboarding) {
      redirect('/onboarding/wizard');
    } else {
      redirect('/agent/dashboard');
    }
  }

  return <SubscriptionPage session={session} flowStatus={flowStatus} />;
}