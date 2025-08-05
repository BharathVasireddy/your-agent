import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export interface UserFlowStatus {
  isAuthenticated: boolean;
  needsSubscription: boolean;
  needsOnboarding: boolean;
  redirectTo: string;
  agent?: {
    id: string;
    slug: string;
    isSubscribed: boolean;
    hasCompletedOnboarding: boolean;
  } | null;
}

/**
 * Determines where a user should be redirected based on their current status
 */
export async function getUserFlowStatus(): Promise<UserFlowStatus> {
  const session = await getServerSession(authOptions);

  // Not authenticated - redirect to sign in
  if (!session?.user) {
    return {
      isAuthenticated: false,
      needsSubscription: false,
      needsOnboarding: false,
      redirectTo: '/auth/signin',
      agent: null
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  // Check if user has an agent profile
  const agent = await prisma.agent.findUnique({
    where: { userId },
    select: {
      id: true,
      slug: true,
      isSubscribed: true,
      experience: true,
      bio: true,
      phone: true,
      city: true,
      area: true,
      createdAt: true,
      updatedAt: true
    }
  });

  // No agent profile - needs subscription and onboarding
  if (!agent) {
    return {
      isAuthenticated: true,
      needsSubscription: true,
      needsOnboarding: true,
      redirectTo: '/onboarding/welcome',
      agent: null
    };
  }

  // Has agent but not subscribed - needs subscription
  if (!agent.isSubscribed) {
    return {
      isAuthenticated: true,
      needsSubscription: true,
      needsOnboarding: false,
      redirectTo: '/subscribe',
      agent: {
        id: agent.id,
        slug: agent.slug,
        isSubscribed: agent.isSubscribed,
        hasCompletedOnboarding: false
      }
    };
  }

  // Check if onboarding is complete (has essential fields)
  const hasCompletedOnboarding = !!(
    agent.experience && 
    agent.phone && 
    agent.city && 
    agent.slug
  );

  // Subscribed but needs onboarding
  if (!hasCompletedOnboarding) {
    return {
      isAuthenticated: true,
      needsSubscription: false,
      needsOnboarding: true,
      redirectTo: '/onboarding/wizard',
      agent: {
        id: agent.id,
        slug: agent.slug,
        isSubscribed: agent.isSubscribed,
        hasCompletedOnboarding: false
      }
    };
  }

  // Fully onboarded - ready for dashboard
  return {
    isAuthenticated: true,
    needsSubscription: false,
    needsOnboarding: false,
    redirectTo: '/agent/dashboard',
    agent: {
      id: agent.id,
      slug: agent.slug,
      isSubscribed: agent.isSubscribed,
      hasCompletedOnboarding: true
    }
  };
}

