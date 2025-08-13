import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Browse deals visible to the current agent based on targeting rules
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
  if (!(session as unknown as { user?: unknown } | null)?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;
  const agent = await prisma.agent.findUnique({ where: { userId } });
  if (!agent) return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const pageSize = Math.min(50, Math.max(1, Number(searchParams.get('pageSize') || '12')));

  // Compute simple 30d analytics for targeting thresholds
  const since = new Date();
  since.setDate(since.getDate() - 30);
  const [profileViews30d, propertyViews30d] = await Promise.all([
    prisma.pageView.count({ where: { agentId: agent.id, page: 'profile', timestamp: { gte: since } } }),
    prisma.pageView.count({ where: { agentId: agent.id, page: 'property', timestamp: { gte: since } } }),
  ]);

  // Basic targeting filter; analytics thresholds to be computed offline or approximated later if needed
  const where: NonNullable<Parameters<typeof prisma.deal.findMany>[0]>['where'] = {
    status: 'Active',
    deletedAt: null,
    AND: [
      {
        OR: [
          { allowedAgentSlugs: { has: agent.slug } },
          { allowedAgentSlugs: { isEmpty: true } },
        ],
      },
      { excludedAgentSlugs: { hasEvery: [] } },
      { NOT: { excludedAgentSlugs: { has: agent.slug } } },
      {
        OR: [
          { allowedCities: { has: agent.city || '' } },
          { allowedCities: { isEmpty: true } },
        ],
      },
      { NOT: { excludedCities: { has: agent.city || '' } } },
      {
        OR: [
          { allowedAreas: { has: agent.area || '' } },
          { allowedAreas: { isEmpty: true } },
        ],
      },
      { NOT: { excludedAreas: { has: agent.area || '' } } },
      // Threshold checks
      {
        OR: [
          { minProfileViewsLast30d: null },
          { minProfileViewsLast30d: { lte: profileViews30d } },
        ],
      },
      {
        OR: [
          { minPageViewsLast30d: null },
          { minPageViewsLast30d: { lte: propertyViews30d } },
        ],
      },
    ],
  };

  const [total, items] = await Promise.all([
    prisma.deal.count({ where }),
    prisma.deal.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * pageSize, take: pageSize }),
  ]);

  return NextResponse.json({ total, page, pageSize, items });
}


