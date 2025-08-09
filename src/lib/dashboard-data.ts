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
    where: { agent: { userId } },
    orderBy: { createdAt: 'desc' }
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

// Agent leads with simple pagination and search
export const getAgentLeads = cache(async (
  userId: string,
  opts: {
    page?: number;
    take?: number;
    q?: string;
    type?: string;
    source?: string;
    startDate?: string; // ISO yyyy-mm-dd
    endDate?: string;   // ISO yyyy-mm-dd
  } = {}
) => {
  const page = Math.max(1, opts.page || 1);
  const take = Math.min(100, Math.max(1, opts.take || 20));
  const skip = (page - 1) * take;

  // Find agent id by user id
  const agent = await prisma.agent.findUnique({ where: { userId }, select: { id: true } });
  if (!agent) {
    return { items: [], total: 0, page, take, pages: 1 } as const;
  }

  // Build date range if provided
  let dateFilter: { gte?: Date; lte?: Date } | undefined;
  if (opts.startDate || opts.endDate) {
    dateFilter = {};
    if (opts.startDate) {
      dateFilter.gte = new Date(opts.startDate + 'T00:00:00.000Z');
    }
    if (opts.endDate) {
      // include full end day
      const end = new Date(opts.endDate + 'T23:59:59.999Z');
      dateFilter.lte = end;
    }
  }

  const where = {
    agentId: agent.id,
    ...(opts.type ? { type: opts.type } : {}),
    ...(opts.source ? { source: { equals: opts.source, mode: 'insensitive' as const } } : {}),
    ...(dateFilter ? { timestamp: dateFilter } : {}),
    ...(opts.q
      ? {
          OR: [
            { metadata: { contains: opts.q, mode: 'insensitive' as const } },
            { source: { contains: opts.q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
  } as const;

  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip,
      take,
      select: {
        id: true,
        type: true,
        source: true,
        timestamp: true,
        propertyId: true,
        metadata: true,
        agentId: true,
      },
    }),
    prisma.lead.count({ where }),
  ]);

  return { items, total, page, take, pages: Math.max(1, Math.ceil(total / take)) } as const;
});

// Filtered, paginated properties for dashboard (lean select)
export const getFilteredAgentProperties = cache(async (
  userId: string,
  opts: {
    listingType?: string;
    propertyType?: string;
    status?: string;
    area?: string;
    q?: string;
    page?: number;
    take?: number;
  }
) => {
  const page = Math.max(1, opts.page || 1);
  const take = Math.min(50, Math.max(1, opts.take || 12));
  const skip = (page - 1) * take;

  const where = {
    agent: { userId },
    ...(opts.listingType ? { listingType: opts.listingType } : {}),
    ...(opts.propertyType ? { propertyType: opts.propertyType } : {}),
    ...(opts.status ? { status: opts.status } : {}),
    ...(opts.area ? { location: { contains: opts.area, mode: 'insensitive' as const } } : {}),
    ...(opts.q
      ? {
          OR: [
            { title: { contains: opts.q, mode: 'insensitive' as const } },
            { description: { contains: opts.q, mode: 'insensitive' as const } },
            { location: { contains: opts.q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    slug: { not: null as unknown as undefined },
  } as const;

  const [items, total] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: {
        id: true,
        slug: true,
        title: true,
        price: true,
        listingType: true,
        propertyType: true,
        status: true,
        createdAt: true,
        photos: true,
      },
    }),
    prisma.property.count({ where }),
  ]);

  return { items, total, page, take, pages: Math.max(1, Math.ceil(total / take)) };
});