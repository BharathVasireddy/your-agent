import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '20')));

  const where = q
    ? {
        OR: [
          { email: { contains: q, mode: 'insensitive' as const } },
          { name: { contains: q, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        accounts: { select: { provider: true } },
        agentProfile: { select: { id: true, slug: true } },
      },
      orderBy: { id: 'desc' },
    }),
  ]);

  const items = users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    image: u.image,
    authProviders: u.accounts.map((a) => a.provider),
    hasAgent: Boolean(u.agentProfile),
    agentSlug: u.agentProfile?.slug || null,
  }));

  return NextResponse.json({ total, page, pageSize, items });
}


