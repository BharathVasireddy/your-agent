import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { type BasePropertyFormData } from '@/types/property';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;

    // Get the user's agent profile
    const agent = await prisma.agent.findUnique({
      where: { userId },
      select: { id: true, isSubscribed: true }
    });

    if (!agent) {
      return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });
    }

    if (!agent.isSubscribed) {
      return NextResponse.json({ error: 'Subscription required to create properties' }, { status: 403 });
    }

    const data: BasePropertyFormData = await request.json();

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
    } else {
      // For other property types, use default values (these will be required when we implement other property types)
      propertyData.area = 0; // TODO: Get this from property-specific form data
      propertyData.bedrooms = null;
      propertyData.bathrooms = null;
      
      // TODO: Add handling for other property types when implemented
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