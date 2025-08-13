import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getCachedAgent } from '@/lib/dashboard-data';
import prisma from '@/lib/prisma';
import { ENTITLEMENTS, type Plan } from '@/lib/subscriptions';
import PropertyCreationWizard from '@/components/property/PropertyCreationWizard';

export default async function NewPropertyPage() {
  // Get the current user's session
  const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
  
  if (!(session as unknown as { user?: unknown } | null)?.user) {
    redirect('/login');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;
  const agent = await getCachedAgent(userId);
  if (!agent) {
    redirect('/subscribe');
  }

  const plan: Plan = (agent.subscriptionPlan as Plan | null) ?? 'starter';
  const limit = ENTITLEMENTS[plan].listingLimit;

  // If user hit the limit, redirect back to properties with an info query param
  if (Number.isFinite(limit)) {
    const currentCount = await prisma.property.count({ where: { agentId: agent.id, sourceDealId: null } });
    if (currentCount >= (limit as number)) {
      redirect('/agent/dashboard/properties?limit=reached');
    }
  }

  return <PropertyCreationWizard />;
}