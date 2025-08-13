import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ENTITLEMENTS, type Plan } from '@/lib/subscriptions';
import { type BasePropertyFormData } from '@/types/property';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
    if (!(session as unknown as { user?: unknown } | null)?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true, subscriptionPlan: true }
    });
    if (!agent) {
      return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });
    }

    const url = new URL(request.url);
    const countOnly = url.searchParams.get('count') === '1';
    const count = await prisma.property.count({ where: { agentId: agent.id, sourceDealId: null } });
    if (countOnly) {
      const plan: Plan = (agent.subscriptionPlan as Plan | null) ?? 'starter';
      const limit = ENTITLEMENTS[plan].listingLimit;
      return NextResponse.json({ count, plan, limit });
    }
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
    
    if (!(session as unknown as { user?: unknown } | null)?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Get the user's agent profile
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true, isSubscribed: true, subscriptionPlan: true }
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });
    }

    const data: BasePropertyFormData = await request.json();

    // Allow creating drafts without subscription; require subscription to publish
    const isDraft = (data.status || '').toLowerCase() === 'draft';
    if (!agent.isSubscribed && !isDraft) {
      return NextResponse.json({ error: 'Subscription required to create properties' }, { status: 403 });
    }

    // Enforce listing limit based on plan (only for published listings)
    const plan = (agent.subscriptionPlan as Plan | null) ?? 'starter';
    const listingLimit = ENTITLEMENTS[plan].listingLimit;
    if (!isDraft && Number.isFinite(listingLimit)) {
      // Exclude deal-adopted properties from plan counts
      const currentCount = await prisma.property.count({ where: { agentId: agent.id, sourceDealId: null } });
      if (currentCount >= (listingLimit as number)) {
        return NextResponse.json({ error: 'Listing limit reached for your plan. Upgrade to add more listings.' }, { status: 403 });
      }
    }

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Ensure slug is unique
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.property.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    // Prepare property data for database
    const propertyData = {
      agentId: agent.id,
      title: data.title,
      description: data.description,
      price: data.price,
      location: data.location,
      amenities: data.amenities,
      photos: data.photos,
      status: data.status,
      listingType: data.listingType,
      propertyType: data.propertyType,
      slug: finalSlug,
      brochureUrl: data.brochureUrl,
      area: 0 as number | null, // Will be updated below based on property type
      bedrooms: null as number | null,
      bathrooms: null as number | null,
      propertyData: null as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    };

    // Handle property-type specific fields
    if (data.propertyType === 'Agricultural Land' && data.agriculturalLandData) {
      // For agricultural land, calculate total area from acres and guntas
      const totalAcres = data.agriculturalLandData.extentAcres + (data.agriculturalLandData.extentGuntas / 40);
      const totalSqFt = Math.round(totalAcres * 43560); // 1 acre = 43,560 sq ft
      
      propertyData.area = totalSqFt;
      propertyData.bedrooms = null;
      propertyData.bathrooms = null;
      propertyData.propertyData = data.agriculturalLandData;
    } else if (data.propertyType === 'Plot' && data.plotData) {
      // For plots, convert square yards to square feet (1 sq yd = 9 sq ft)
      const totalSqFt = Math.round(data.plotData.extentSqYds * 9);

      propertyData.area = totalSqFt;
      propertyData.bedrooms = null;
      propertyData.bathrooms = null;
      propertyData.propertyData = data.plotData;
    } else if (data.propertyType === 'Flat/Apartment' && data.flatApartmentData) {
      // For flats, area is provided directly in square feet
      propertyData.area = data.flatApartmentData.flatAreaSqFt || 0;
      
      // Extract BHK number from string like "2BHK"
      const bhkMatch = (data.flatApartmentData.bhk || '').match(/(\d+)/);
      const bhkNumber = bhkMatch ? parseInt(bhkMatch[1]) : null;
      propertyData.bedrooms = bhkNumber;
      
      // Bathrooms not specified in fields; keep null
      propertyData.bathrooms = null;
      propertyData.propertyData = data.flatApartmentData;
    } else if (data.propertyType === 'Villa/Independent House' && data.villaIndependentHouseData) {
      // For villas, area is provided directly in square feet
      propertyData.area = data.villaIndependentHouseData.villaAreaSqFt || 0;

      // Extract BHK number from string like "3BHK"
      const bhkMatch = (data.villaIndependentHouseData.bhk || '').match(/(\d+)/);
      const bhkNumber = bhkMatch ? parseInt(bhkMatch[1]) : null;
      propertyData.bedrooms = bhkNumber;

      // Bathrooms not specified separately; keep null
      propertyData.bathrooms = null;
      propertyData.propertyData = data.villaIndependentHouseData;
    } else if (data.propertyType === 'IT Commercial Space' && data.itCommercialSpaceData) {
      // For IT commercial space, set area to per-unit area for consistency
      propertyData.area = data.itCommercialSpaceData.perUnitAreaSqFt || 0;
      propertyData.bedrooms = null;
      propertyData.bathrooms = null;
      propertyData.propertyData = data.itCommercialSpaceData;
    } else if (data.propertyType === 'Farm House' && data.farmHouseData) {
      // For farm houses, area is the overall area in sq.ft
      propertyData.area = data.farmHouseData.overallAreaSqFt || 0;
      // Derive bedrooms from BHK
      const bhkMatch = (data.farmHouseData.bhk || '').match(/(\d+)/);
      const bhkNumber = bhkMatch ? parseInt(bhkMatch[1]) : null;
      propertyData.bedrooms = bhkNumber;
      propertyData.bathrooms = null;
      propertyData.propertyData = data.farmHouseData;
    } else {
      // For other property types, use default values until implemented
      propertyData.area = 0;
      propertyData.bedrooms = null;
      propertyData.bathrooms = null;
    }

    // Create the property
    const property = await prisma.property.create({
      data: propertyData
    });

    return NextResponse.json({ 
      success: true, 
      property: {
        id: property.id,
        slug: property.slug,
        title: property.title
      }
    });

  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}