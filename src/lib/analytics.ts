import prisma from './prisma';

// Track page views
export async function trackPageView({
  agentId,
  page,
  propertyId,
  request,
}: {
  agentId: string;
  page: 'profile' | 'property';
  propertyId?: string;
  request: Request;
}) {
  try {
    // Extract tracking data from request
    const userAgent = request.headers.get('user-agent') || '';
    const referer = request.headers.get('referer') || '';
    const xForwardedFor = request.headers.get('x-forwarded-for');
    const xRealIp = request.headers.get('x-real-ip');
    
    // Get IP address for deduplication
    const ipAddress = xForwardedFor?.split(',')[0] || xRealIp || 'unknown';
    
    // Determine device type from user agent
    const device = getDeviceType(userAgent);
    
    // Determine traffic source from referer
    const source = getTrafficSource(referer);
    
    // Get location from Vercel geo headers (if available)
    const location = request.headers.get('x-vercel-ip-city') || null;

    // Create page view record
    await prisma.pageView.create({
      data: {
        agentId,
        page,
        propertyId,
        source,
        device,
        location,
        ipAddress,
        userAgent: userAgent.substring(0, 500), // Limit length
      },
    });
  } catch (error) {
    console.error('Failed to track page view:', error);
    // Don't throw - analytics shouldn't break the app
  }
}

// Track lead generation
export async function trackLead({
  agentId,
  type,
  propertyId,
  source,
  metadata,
}: {
  agentId: string;
  type: 'CALL' | 'WHATSAPP' | 'FORM' | 'EMAIL';
  propertyId?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.lead.create({
      data: {
        agentId,
        type,
        propertyId,
        source,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });
  } catch (error) {
    console.error('Failed to track lead:', error);
    // Don't throw - analytics shouldn't break the app
  }
}

// Helper function to determine device type
function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

// Helper function to determine traffic source
function getTrafficSource(referer: string): string {
  if (!referer) return 'direct';
  
  const refererLower = referer.toLowerCase();
  
  // Social media
  if (refererLower.includes('facebook') || 
      refererLower.includes('instagram') || 
      refererLower.includes('linkedin') ||
      refererLower.includes('whatsapp') ||
      refererLower.includes('t.co') || // Twitter
      refererLower.includes('wa.me')) { // WhatsApp
    return 'social';
  }
  
  // Search engines
  if (refererLower.includes('google') || 
      refererLower.includes('bing') || 
      refererLower.includes('yahoo') ||
      refererLower.includes('duckduckgo')) {
    return 'search';
  }
  
  // If it has a domain but not social/search, it's referral
  return 'referral';
}

// Get comprehensive analytics data for an agent
export async function getAgentAnalytics(agentId: string, days: number = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  try {
    const [
      totalVisitors,
      totalPropertyViews,
      totalLeads,
      trafficSources,
      deviceBreakdown,
      topLocations,
      topProperties,
      leadBreakdown,
      dailyTrend,
    ] = await Promise.all([
      // Total unique visitors (deduplicated by IP)
      prisma.pageView.findMany({
        where: {
          agentId,
          timestamp: { gte: since },
        },
        select: { ipAddress: true },
        distinct: ['ipAddress'],
      }),
      
      // Total property views
      prisma.pageView.count({
        where: {
          agentId,
          page: 'property',
          timestamp: { gte: since },
        },
      }),
      
      // Total leads
      prisma.lead.count({
        where: {
          agentId,
          timestamp: { gte: since },
        },
      }),
      
      // Traffic sources
      prisma.pageView.groupBy({
        by: ['source'],
        where: {
          agentId,
          timestamp: { gte: since },
        },
        _count: { source: true },
      }),
      
      // Device breakdown
      prisma.pageView.groupBy({
        by: ['device'],
        where: {
          agentId,
          timestamp: { gte: since },
        },
        _count: { device: true },
      }),
      
      // Top locations
      prisma.pageView.groupBy({
        by: ['location'],
        where: {
          agentId,
          location: { not: null },
          timestamp: { gte: since },
        },
        _count: { location: true },
        orderBy: { _count: { location: 'desc' } },
        take: 3,
      }),
      
      // Top viewed properties
      prisma.pageView.groupBy({
        by: ['propertyId'],
        where: {
          agentId,
          page: 'property',
          propertyId: { not: null },
          timestamp: { gte: since },
        },
        _count: { propertyId: true },
        orderBy: { _count: { propertyId: 'desc' } },
        take: 5,
      }),
      
      // Lead type breakdown
      prisma.lead.groupBy({
        by: ['type'],
        where: {
          agentId,
          timestamp: { gte: since },
        },
        _count: { type: true },
      }),
      
      // Daily trend for the last 7 days
      prisma.$queryRaw`
        SELECT 
          DATE(timestamp) as date,
          COUNT(DISTINCT ip_address) as visitors,
          COUNT(CASE WHEN page = 'property' THEN 1 END) as property_views
        FROM "PageView" 
        WHERE agent_id = ${agentId} 
        AND timestamp >= ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
        GROUP BY DATE(timestamp)
        ORDER BY date DESC
        LIMIT 7
      `,
    ]);

    // Get property details for top properties
    const propertyIds = topProperties
      .filter(p => p.propertyId)
      .map(p => p.propertyId!);
    
    const properties = propertyIds.length > 0 ? await prisma.property.findMany({
      where: { id: { in: propertyIds } },
      select: { id: true, title: true, price: true },
    }) : [];

    const topPropertiesWithDetails = topProperties.map(p => {
      const property = properties.find(prop => prop.id === p.propertyId);
      return {
        id: p.propertyId!,
        title: property?.title || 'Unknown Property',
        price: property?.price || 0,
        views: p._count.propertyId,
      };
    });

    // Calculate conversion rate
    const uniqueVisitors = totalVisitors.length;
    const conversionRate = uniqueVisitors > 0 ? (totalLeads / uniqueVisitors) * 100 : 0;

    return {
      // KPI Bar
      totalVisitors: uniqueVisitors,
      totalPropertyViews,
      totalLeads,
      conversionRate: Math.round(conversionRate * 100) / 100,
      
      // Traffic Sources
      trafficSources: trafficSources.map(s => ({
        source: s.source,
        count: s._count.source,
      })),
      
      // Device Breakdown
      deviceBreakdown: deviceBreakdown.map(d => ({
        device: d.device,
        count: d._count.device,
      })),
      
      // Top Locations
      topLocations: topLocations.map(l => ({
        location: l.location!,
        count: l._count.location,
      })),
      
      // Top Properties
      topProperties: topPropertiesWithDetails,
      
      // Lead Breakdown
      leadBreakdown: leadBreakdown.map(l => ({
        type: l.type,
        count: l._count.type,
      })),
      
      // Daily Trend
      dailyTrend: dailyTrend as Array<{
        date: string;
        visitors: number;
        property_views: number;
      }>,
    };
  } catch (error) {
    console.error('Failed to get analytics:', error);
    
    // Return empty data structure on error
    return {
      totalVisitors: 0,
      totalPropertyViews: 0,
      totalLeads: 0,
      conversionRate: 0,
      trafficSources: [],
      deviceBreakdown: [],
      topLocations: [],
      topProperties: [],
      leadBreakdown: [],
      dailyTrend: [],
    };
  }
}