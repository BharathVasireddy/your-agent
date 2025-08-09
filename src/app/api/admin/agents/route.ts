import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const city = (searchParams.get('city') || '').trim();
  const subscribed = searchParams.get('subscribed');
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '20')));

  const where: NonNullable<Parameters<typeof prisma.agent.findMany>[0]>['where'] = {
    ...(q
      ? {
          OR: [
            { slug: { contains: q, mode: 'insensitive' } },
            { user: { email: { contains: q, mode: 'insensitive' } } },
            { city: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(city ? { city: { contains: city, mode: 'insensitive' } } : {}),
    ...(subscribed === 'true' ? { isSubscribed: true } : {}),
    ...(subscribed === 'false' ? { isSubscribed: false } : {}),
  };

  const [total, agents] = await Promise.all([
    prisma.agent.count({ where }),
    prisma.agent.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        slug: true,
        city: true,
        area: true,
        isSubscribed: true,
        createdAt: true,
        user: { select: { email: true, id: true } },
        _count: { select: { properties: true, leads: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return NextResponse.json({ total, page, pageSize, items: agents });
}


