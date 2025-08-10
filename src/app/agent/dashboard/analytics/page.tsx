import { redirect } from 'next/navigation';
import { getFastAnalytics } from '@/lib/analytics-fast';
import AnalyticsDashboard from './AnalyticsDashboard';
import { Suspense } from 'react';
import { PageLoader } from '@/components/PageLoader';
import { getCachedSession, getCachedAgent } from '@/lib/dashboard-data';

export default async function AnalyticsPage() {
  // Use cached session
  const session = await getCachedSession();
  
  if (!session?.user) {
    redirect('/login');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Use cached agent lookup
  const agent = await getCachedAgent(userId);

  if (!agent) {
    redirect('/subscribe');
  }

  // Get fast analytics data - much faster than complex queries
  const analyticsData = await getFastAnalytics(agent.id, 30);

  return (
    <Suspense fallback={<PageLoader message="Loading analytics..." />}>
      <AnalyticsDashboard data={analyticsData} />
    </Suspense>
  );
}