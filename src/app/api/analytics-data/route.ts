import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { getFastAnalytics } from '@/lib/analytics-fast';
import { getCachedAgent } from '@/lib/dashboard-data';

export async function GET() {
  try {
    const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
    
    if (!(session as unknown as { user?: unknown } | null)?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Use cached agent lookup
    const agent = await getCachedAgent(userId);

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    // Get fast analytics data
    const analyticsData = await getFastAnalytics(agent.id, 30);

    return NextResponse.json(analyticsData);

  } catch (error) {
    console.error('Analytics data API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}