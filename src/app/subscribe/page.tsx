import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserFlowStatus } from '@/lib/userFlow';
import SubscriptionPage from './SubscriptionPage';

export default async function SubscribePage() {
  // Check authentication
  const session = await getServerSession(authOptions);
  
  if (!(session as unknown as { user?: unknown } | null)?.user) {
    redirect('/login');
  }

  // Check user flow status
  const flowStatus = await getUserFlowStatus();
  
  // In production, if already subscribed, redirect based on onboarding status.
  // In development, always render the page so you can test the flow.
  if (process.env.NODE_ENV === 'production' && !flowStatus.needsSubscription) {
    if (flowStatus.needsOnboarding) redirect('/onboarding/wizard');
    redirect('/agent/dashboard');
  }

  return <SubscriptionPage session={session as unknown as { user: { id: string; email: string; name: string } }} flowStatus={flowStatus} />;
}