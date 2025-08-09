import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET(_req: Request, context: { params: Promise<{ slug: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug } = await context.params;
  const agent = await prisma.agent.findUnique({
    where: { slug },
    include: {
      user: true,
      properties: { orderBy: { createdAt: 'desc' }, take: 10 },
      leads: { orderBy: { timestamp: 'desc' }, take: 10 },
      pageViews: { orderBy: { timestamp: 'desc' }, take: 10 },
      testimonials: true,
      faqs: true,
    },
  });

  if (!agent) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ agent });
}


