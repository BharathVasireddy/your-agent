import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { PerformanceUtils } from '@/lib/performance';
import { getCachedAllProperties } from '@/lib/dashboard-data';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Use cached properties
    const properties = await getCachedAllProperties(userId);

    // Filter properties with valid slugs and group by listing type
    const validProperties = properties.filter(p => p.slug !== null);
    const saleProperties = validProperties.filter(p => p.listingType === 'Sale');
    const rentProperties = validProperties.filter(p => p.listingType === 'Rent');

    const res = NextResponse.json({
      saleProperties,
      rentProperties
    });
    if (PerformanceUtils.isOptimizationEnabled('caching')) {
      res.headers.set('Cache-Control', `public, s-maxage=${PerformanceUtils.getRevalidateTime() || 60}, stale-while-revalidate=300`);
    }
    return res;

  } catch (error) {
    console.error('Properties data API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}