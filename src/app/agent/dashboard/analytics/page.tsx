import { redirect } from 'next/navigation';
import { getFastAnalytics } from '@/lib/analytics-fast';
import AnalyticsDashboard from './AnalyticsDashboard';
import { Suspense } from 'react';
import { PageLoader } from '@/components/PageLoader';
import { getCachedSession, getCachedAgent } from '@/lib/dashboard-data';

export default async function AnalyticsPage() {
  // Use cached session
  const raw = await getCachedSession();
  const session = raw as { user?: { id?: string } } | null;
  if (!session?.user?.id) {
    redirect('/login');
  }

  const userId = session.user.id as string;

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