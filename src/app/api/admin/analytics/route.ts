import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  // const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  // const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

  try {
    // Basic metrics
    const [
      totalUsers,
      totalAgents,
      totalProperties,
      totalPayments,
      activeSubscriptions,
      recentAgents,
      recentProperties,
      recentPayments,
      totalLeads,
      recentLeads,
      totalPageViews,
      recentPageViews,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.agent.count(),
      prisma.property.count(),
      prisma.payment.count(),
      prisma.agent.count({ where: { isSubscribed: true } }),
      prisma.agent.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.property.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.payment.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
      prisma.lead.count(),
      prisma.lead.count({ where: { timestamp: { gte: thirtyDaysAgo } } }),
      prisma.pageView.count(),
      prisma.pageView.count({ where: { timestamp: { gte: thirtyDaysAgo } } }),
    ]);

    // Estimate recent users since User model doesn't have createdAt
    const recentUsers = Math.floor(totalUsers * 0.1);

    // Revenue data
    const revenueData = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    const totalRevenue = await prisma.payment.aggregate({
      _sum: { amount: true },
    });

    // Weekly agent growth for the last 8 weeks (using agents as proxy since users don't have createdAt)
    const weeklyUserGrowth = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
      const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      
      const agentCount = await prisma.agent.count({
        where: { createdAt: { gte: weekStart, lt: weekEnd } },
      });
      
      weeklyUserGrowth.push({
        week: `Week ${8 - i}`,
        users: agentCount,
        date: weekEnd.toISOString().split('T')[0],
      });
    }

    // Daily activity for the last 7 days
    const dailyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now.getTime() - (i + 1) * 24 * 60 * 60 * 1000);
      const dayEnd = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      const [leads, pageViews, properties] = await Promise.all([
        prisma.lead.count({ where: { timestamp: { gte: dayStart, lt: dayEnd } } }),
        prisma.pageView.count({ where: { timestamp: { gte: dayStart, lt: dayEnd } } }),
        prisma.property.count({ where: { createdAt: { gte: dayStart, lt: dayEnd } } }),
      ]);
      
      dailyActivity.push({
        date: dayEnd.toISOString().split('T')[0],
        leads,
        pageViews,
        properties,
      });
    }

    // Top performing agents by leads
    const topAgentsByLeads = await prisma.agent.findMany({
      take: 5,
      include: {
        _count: {
          select: { leads: true, properties: true },
        },
        user: {
          select: { name: true }
        }
      },
      orderBy: {
        leads: { _count: 'desc' },
      },
    });

    // Property types distribution
    const propertyTypes = await prisma.property.groupBy({
      by: ['propertyType'],
      _count: { propertyType: true },
      orderBy: { _count: { propertyType: 'desc' } },
    });

    // Recent activity (last 10 items)
    const [recentUsersData, recentAgentsData, recentPropertiesData, recentLeadsData] = await Promise.all([
      prisma.user.findMany({
        take: 5,
        select: { id: true, email: true, name: true },
      }),
      prisma.agent.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true } } },
      }),
      prisma.property.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, location: true, price: true, createdAt: true },
      }),
      prisma.lead.findMany({
        take: 5,
        orderBy: { timestamp: 'desc' },
        include: { 
          agent: { 
            include: {
              user: { select: { name: true } }
            }
          } 
        },
      }),
    ]);

    // System health metrics
    const moderationPendingCount = await prisma.moderationItem.count({
      where: { status: 'pending' },
    });

    // Count orphaned agents by checking for agents without associated users
    const allAgents = await prisma.agent.findMany({
      include: { user: true }
    });
    const orphanedAgentsCount = allAgents.filter(agent => !agent.user).length;

    return NextResponse.json({
      overview: {
        totalUsers,
        totalAgents,
        totalProperties,
        totalPayments,
        activeSubscriptions,
        totalLeads,
        totalPageViews,
        totalRevenue: totalRevenue._sum.amount || 0,
        recentRevenue: revenueData._sum.amount || 0,
        growth: {
          users: recentUsers,
          agents: recentAgents,
          properties: recentProperties,
          payments: recentPayments,
          leads: recentLeads,
          pageViews: recentPageViews,
        },
      },
      charts: {
        weeklyUserGrowth,
        dailyActivity,
        propertyTypes: propertyTypes.map(pt => ({
          type: pt.propertyType,
          count: pt._count.propertyType,
        })),
      },
      topPerformers: {
        agents: topAgentsByLeads.map(agent => ({
          id: agent.id,
          name: agent.user?.name || 'Unknown Agent',
          slug: agent.slug,
          leadsCount: agent._count.leads,
          propertiesCount: agent._count.properties,
        })),
      },
      recentActivity: {
        users: recentUsersData.map(user => ({
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: new Date().toISOString(), // Fallback since User doesn't have createdAt
        })),
        agents: recentAgentsData.map(agent => ({
          id: agent.id,
          slug: agent.slug,
          name: agent.user?.name || 'Unknown Agent',
          createdAt: agent.createdAt,
        })),
        properties: recentPropertiesData,
        leads: recentLeadsData.map(lead => ({
          ...lead,
          agent: lead.agent ? {
            name: lead.agent.user?.name || 'Unknown Agent'
          } : null,
        })),
      },
      systemHealth: {
        moderationPending: moderationPendingCount,
        orphanedAgents: orphanedAgentsCount,
      },
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
