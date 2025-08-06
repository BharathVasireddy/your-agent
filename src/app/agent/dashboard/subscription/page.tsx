import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getCachedAgent } from '@/lib/dashboard-data';
import SubscriptionManagement from './SubscriptionManagement';

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;
  const agent = await getCachedAgent(userId);

  if (!agent) {
    redirect('/subscribe');
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Subscription</h1>
        <p className="text-zinc-600 mt-1">Manage your YourAgent.in subscription</p>
      </div>

      {/* Subscription Management */}
      <SubscriptionManagement agent={agent} />
    </div>
  );
}