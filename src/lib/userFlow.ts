import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export interface UserFlowStatus {
  isAuthenticated: boolean;
  needsSubscription: boolean;
  needsOnboarding: boolean;
  needsTour: boolean;
  redirectTo: string;
  agent?: {
    id: string;
    slug: string;
    isSubscribed: boolean;
    hasCompletedOnboarding: boolean;
    hasSeenTour: boolean;
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
      needsTour: false,
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
      specialization: true,
      bio: true,
      phone: true,
      city: true,
      hasSeenTour: true,
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
      needsTour: false,
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
      needsTour: false,
      redirectTo: '/subscribe',
      agent: {
        id: agent.id,
        slug: agent.slug,
        isSubscribed: agent.isSubscribed,
        hasCompletedOnboarding: false,
        hasSeenTour: agent.hasSeenTour || false
      }
    };
  }

  // Check if onboarding is complete (has essential fields)
  const hasCompletedOnboarding = !!(
    agent.specialization && 
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
      needsTour: false,
      redirectTo: '/onboarding/wizard',
      agent: {
        id: agent.id,
        slug: agent.slug,
        isSubscribed: agent.isSubscribed,
        hasCompletedOnboarding: false,
        hasSeenTour: agent.hasSeenTour || false
      }
    };
  }

  // Fully onboarded but hasn't seen tour
  const needsTour = !agent.hasSeenTour;

  return {
    isAuthenticated: true,
    needsSubscription: false,
    needsOnboarding: false,
    needsTour,
    redirectTo: '/agent/dashboard',
    agent: {
      id: agent.id,
      slug: agent.slug,
      isSubscribed: agent.isSubscribed,
      hasCompletedOnboarding: true,
      hasSeenTour: agent.hasSeenTour || false
    }
  };
}

/**
 * Marks that the user has seen the dashboard tour
 */
export async function markTourAsComplete(userId: string): Promise<void> {
  await prisma.agent.update({
    where: { userId },
    data: { hasSeenTour: true }
  });
}