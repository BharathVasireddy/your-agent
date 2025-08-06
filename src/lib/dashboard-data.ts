import { cache } from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Cache session for the entire request lifecycle
export const getCachedSession = cache(async () => {
  return getServerSession(authOptions);
});

// Cache agent data for the entire request lifecycle
export const getCachedAgent = cache(async (userId: string) => {
  return prisma.agent.findUnique({
    where: { userId },
    include: { user: true }
  });
});

// Cache agent profile with relations for profile page
export const getCachedAgentProfile = cache(async (userId: string) => {
  return prisma.agent.findUnique({
    where: { userId },
    include: { 
      user: true,
      testimonials: true,
      faqs: true
    }
  });
});

// Cache properties for dashboard
export const getCachedDashboardProperties = cache(async (userId: string) => {
  return prisma.property.findMany({
    where: { agent: { userId } },
    orderBy: { createdAt: 'desc' },
    take: 5 // Show only recent 5 properties for dashboard
  });
});

// Cache all properties for properties page
export const getCachedAllProperties = cache(async (userId: string) => {
  return prisma.property.findMany({
    where: {
      agent: {
        userId: userId
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
});

// Cache single property for edit
export const getCachedProperty = cache(async (slug: string, userId: string) => {
  return prisma.property.findFirst({
    where: {
      slug,
      agent: { userId }
    }
  });
});

// Optimized property analytics - only count, no heavy queries
export const getPropertyCounts = cache(async (userId: string) => {
  const [saleCount, rentCount, availableCount] = await Promise.all([
    prisma.property.count({
      where: { 
        agent: { userId },
        listingType: 'Sale',
        slug: { not: null }
      }
    }),
    prisma.property.count({
      where: { 
        agent: { userId },
        listingType: 'Rent',
        slug: { not: null }
      }
    }),
    prisma.property.count({
      where: { 
        agent: { userId },
        status: 'Available',
        slug: { not: null }
      }
    })
  ]);

  return {
    saleProperties: saleCount,
    rentProperties: rentCount,
    availableProperties: availableCount
  };
});