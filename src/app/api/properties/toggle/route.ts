import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
    if (!(session as unknown as { user?: unknown } | null)?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || '';
    const desired = searchParams.get('hidden');

    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

    const agent = await prisma.agent.findUnique({ where: { userId }, select: { id: true } });
    if (!agent) return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });

    const property = await prisma.property.findFirst({ where: { slug, agentId: agent.id } });
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    if (!property.sourceDealId) return NextResponse.json({ error: 'Only deal properties can be toggled' }, { status: 400 });

    const isHiddenByAgent = desired === null ? !property.isHiddenByAgent : desired === '1' || desired === 'true';

    await prisma.property.update({ where: { id: property.id }, data: { isHiddenByAgent } });
    return NextResponse.json({ success: true, isHiddenByAgent });
  } catch (error) {
    console.error('Failed to toggle property visibility', error);
    return NextResponse.json({ error: 'Failed to toggle' }, { status: 500 });
  }
}


