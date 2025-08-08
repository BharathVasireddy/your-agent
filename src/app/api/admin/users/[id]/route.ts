import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await context.params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      accounts: true,
      sessions: true,
      agentProfile: true,
      payments: { orderBy: { createdAt: 'desc' } },
    },
  });

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({ user });
}


