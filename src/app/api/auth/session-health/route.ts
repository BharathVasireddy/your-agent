import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getUserFlowStatus } from '@/lib/userFlow';

export async function GET() {
  try {
    const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
    if (!(session as unknown as { user?: unknown } | null)?.user) {
      return NextResponse.json({ valid: false });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true } });
    if (!user) {
      return NextResponse.json({ valid: false });
    }
    const flow = await getUserFlowStatus();
    return NextResponse.json({ valid: true, flow });
  } catch {
    return NextResponse.json({ valid: false });
  }
}


