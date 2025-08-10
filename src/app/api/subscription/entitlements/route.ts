import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ENTITLEMENTS, type Plan } from '@/lib/subscriptions';

function parseSelectedPlanCookie(cookieHeader?: string | null): { plan?: Plan; interval?: string } {
  try {
    if (!cookieHeader) return {};
    const parts = cookieHeader.split('; ').find(c => c.startsWith('selectedPlan='));
    if (!parts) return {};
    const value = decodeURIComponent(parts.split('=')[1] || '');
    const parsed = JSON.parse(value);
    return { plan: parsed.plan as Plan | undefined, interval: parsed.interval as string | undefined };
  } catch { return {}; }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let plan: Plan = 'starter';
    let active = false;

    if (session?.user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userId = (session as any).user.id as string;
      const agent = await prisma.agent.findUnique({ where: { userId }, select: { subscriptionPlan: true, subscriptionEndsAt: true } });
      if (agent?.subscriptionPlan) plan = agent.subscriptionPlan as Plan;
      active = !!agent?.subscriptionEndsAt && agent.subscriptionEndsAt > new Date();
    } else {
      // unauthenticated: use preselected cookie to determine UI entitlements
      const { plan: cookiePlan } = parseSelectedPlanCookie(req.headers.get('cookie'));
      if (cookiePlan) plan = cookiePlan;
    }

    const entitlements = ENTITLEMENTS[plan];
    return NextResponse.json({ plan, active, entitlements });
  } catch (e) {
    console.error('Entitlements API error:', e);
    return NextResponse.json({ plan: 'starter', active: false, entitlements: ENTITLEMENTS['starter'] });
  }
}


