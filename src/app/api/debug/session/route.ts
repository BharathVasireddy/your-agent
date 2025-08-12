import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserFlowStatus } from '@/lib/userFlow';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get session
    const session = await getServerSession(authOptions);
    
    if (!(session as unknown as { user?: unknown } | null)?.user) {
      return NextResponse.json({ 
        error: 'Not authenticated',
        session: null,
        userFlowStatus: null
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Get user flow status
    const flowStatus = await getUserFlowStatus();
    
    // Get agent data
    const agentData = await prisma.agent.findUnique({
      where: { userId },
      select: {
        id: true,
        slug: true,
        isSubscribed: true,
        subscriptionEndsAt: true,
        userId: true,
        experience: true,
        phone: true,
        city: true,
        area: true,
      }
    });

    // Get user data
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        agentProfile: {
          select: {
            id: true,
            isSubscribed: true,
            subscriptionEndsAt: true,
          }
        }
      }
    });

    return NextResponse.json({
      debug: {
        sessionUserId: userId,
        userFound: !!userData,
        agentFound: !!agentData,
        agentSubscribed: agentData?.isSubscribed || false,
        flowNeedsSubscription: flowStatus.needsSubscription,
        flowRedirectTo: flowStatus.redirectTo,
        userIdMatch: userId === agentData?.userId,
        environment: process.env.NODE_ENV,
        bypassEnabled: process.env.NODE_ENV === 'development' || process.env.BYPASS_SUBSCRIPTION === 'true'
      },
      session: {
        user: {
          id: userId,
          email: (session as unknown as { user?: { email?: string | null } }).user?.email || null,
          name: (session as unknown as { user?: { name?: string | null } }).user?.name || null,
        }
      },
      userData,
      agentData,
      flowStatus
    });

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}