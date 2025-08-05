import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserFlowStatus } from '@/lib/userFlow';
import WelcomeFlow from './WelcomeFlow';

export default async function WelcomePage() {
  // Check authentication
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  // Check user flow status
  const flowStatus = await getUserFlowStatus();
  
  // If user already has what they need, redirect appropriately
  if (!flowStatus.needsSubscription && !flowStatus.needsOnboarding) {
    redirect('/agent/dashboard');
  }

  return <WelcomeFlow session={session} flowStatus={flowStatus} />;
}