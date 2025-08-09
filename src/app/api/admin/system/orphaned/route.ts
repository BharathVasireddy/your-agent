import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const allAgents = await prisma.agent.findMany({
    select: {
      id: true,
      slug: true,
      userId: true,
      isSubscribed: true,
      subscriptionEndsAt: true,
      createdAt: true,
      user: {
        select: { id: true, email: true, name: true }
      }
    }
  });

  const orphanedAgents = allAgents.filter((a) => !a.user);

  const stats = {
    totalAgents: allAgents.length,
    orphanedAgents: orphanedAgents.length,
    subscribedOrphaned: orphanedAgents.filter((a) => a.isSubscribed).length,
    healthyAgents: allAgents.length - orphanedAgents.length,
  };

  return NextResponse.json({
    stats,
    orphanedAgents: orphanedAgents.map((a) => ({
      id: a.id,
      slug: a.slug,
      userId: a.userId,
      isSubscribed: a.isSubscribed,
      subscriptionEndsAt: a.subscriptionEndsAt,
      createdAt: a.createdAt,
    })),
  });
}


