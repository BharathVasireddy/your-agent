import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { PerformanceUtils } from '@/lib/performance';
import { 
  getCachedAgent, 
  getCachedDashboardProperties,
  getPropertyCounts 
} from '@/lib/dashboard-data';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Use cached data - same as server component but via API
    const [agent, properties, counts] = await Promise.all([
      getCachedAgent(userId),
      getCachedDashboardProperties(userId),
      getPropertyCounts(userId)
    ]);

    // Filter properties with valid slugs
    const validProperties = properties.filter(p => p.slug !== null);

    const res = NextResponse.json({
      agent,
      properties: validProperties,
      counts
    });
    if (PerformanceUtils.isOptimizationEnabled('caching')) {
      res.headers.set('Cache-Control', `public, s-maxage=${PerformanceUtils.getRevalidateTime() || 60}, stale-while-revalidate=300`);
    }
    return res;

  } catch (error) {
    console.error('Dashboard data API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}