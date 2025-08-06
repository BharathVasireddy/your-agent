import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAgentAnalytics } from '@/lib/analytics';
import AnalyticsDashboard from './AnalyticsDashboard';

import prisma from '@/lib/prisma';

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Get agent profile to get agent ID for analytics
  const agent = await prisma.agent.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!agent) {
    redirect('/subscribe');
  }

  // Get analytics data for the last 30 days
  const analyticsData = await getAgentAnalytics(agent.id, 30);

  return <AnalyticsDashboard data={analyticsData} />;
}