import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [
    usersCount,
    agentsCount,
    propertiesCount,
    payments30dCount,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.agent.count(),
    prisma.property.count(),
    prisma.payment.count({ where: { createdAt: { gte: since } } }),
  ]);

  return NextResponse.json({
    usersCount,
    agentsCount,
    propertiesCount,
    paymentsLast30Days: payments30dCount,
  });
}


