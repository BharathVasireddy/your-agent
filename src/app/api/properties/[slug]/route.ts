import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { type BasePropertyFormData } from '@/types/property';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
    
    if (!(session as unknown as { user?: unknown } | null)?.user) {
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

    // Find the property and verify ownership
    const existingProperty = await prisma.property.findFirst({
      where: {
        slug: slug,
        agentId: agent.id
      }
    });

    if (!existingProperty) {
      return NextResponse.json({ error: 'Property not found or unauthorized' }, { status: 404 });
    }

    // For deal-adopted properties, disallow edits; only allow show/hide via a separate endpoint
    if (existingProperty.sourceDealId) {
      return NextResponse.json({ error: 'This property is managed by admin (deal). Editing is disabled.' }, { status: 403 });
    }

    const data: BasePropertyFormData = await request.json();

    // Prepare property data for update
    const propertyData = {
      title: data.title,
      description: data.description,
      price: data.price,
      location: data.location,
      amenities: data.amenities,
      photos: data.photos,
      status: data.status,
      listingType: data.listingType,
      propertyType: data.propertyType,
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
      // For flats, use flat area (sq ft) and derive bedrooms from BHK
      propertyData.area = data.flatApartmentData.flatAreaSqFt || 0;
      const bhkMatch = (data.flatApartmentData.bhk || '').match(/(\d+)/);
      const bhkNumber = bhkMatch ? parseInt(bhkMatch[1]) : null;
      propertyData.bedrooms = bhkNumber;
      propertyData.bathrooms = existingProperty.bathrooms; // keep as-is (not part of form)
      propertyData.propertyData = data.flatApartmentData;
    } else if (data.propertyType === 'Villa/Independent House' && data.villaIndependentHouseData) {
      // For villas, use villa area (sq ft) and derive bedrooms from BHK
      propertyData.area = data.villaIndependentHouseData.villaAreaSqFt || 0;
      const bhkMatch = (data.villaIndependentHouseData.bhk || '').match(/(\d+)/);
      const bhkNumber = bhkMatch ? parseInt(bhkMatch[1]) : null;
      propertyData.bedrooms = bhkNumber;
      propertyData.bathrooms = existingProperty.bathrooms; // unchanged
      propertyData.propertyData = data.villaIndependentHouseData;
    } else if (data.propertyType === 'IT Commercial Space' && data.itCommercialSpaceData) {
      // For IT commercial space, set area to per-unit area
      propertyData.area = data.itCommercialSpaceData.perUnitAreaSqFt || 0;
      propertyData.bedrooms = existingProperty.bedrooms; // unchanged
      propertyData.bathrooms = existingProperty.bathrooms; // unchanged
      propertyData.propertyData = data.itCommercialSpaceData;
    } else if (data.propertyType === 'Farm House' && data.farmHouseData) {
      // For farm house, set area to overall area and derive bedrooms from BHK
      propertyData.area = data.farmHouseData.overallAreaSqFt || 0;
      const bhkMatch = (data.farmHouseData.bhk || '').match(/(\d+)/);
      const bhkNumber = bhkMatch ? parseInt(bhkMatch[1]) : null;
      propertyData.bedrooms = bhkNumber;
      propertyData.bathrooms = existingProperty.bathrooms; // unchanged
      propertyData.propertyData = data.farmHouseData;
    } else {
      // For other property types, preserve existing values
      propertyData.area = existingProperty.area;
      propertyData.bedrooms = existingProperty.bedrooms;
      propertyData.bathrooms = existingProperty.bathrooms;
      // Preserve existing propertyData blob
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (propertyData as any).propertyData = existingProperty.propertyData as any;
    }

    // Update the property
    const updatedProperty = await prisma.property.update({
      where: { id: existingProperty.id },
      data: propertyData
    });

    return NextResponse.json({ 
      success: true, 
      property: {
        id: updatedProperty.id,
        slug: updatedProperty.slug,
        title: updatedProperty.title
      }
    });

  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

// Toggle show/hide for deal-adopted properties
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
    if (!(session as unknown as { user?: unknown } | null)?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userId = (session as any).user.id as string;
    const agent = await prisma.agent.findUnique({ where: { userId }, select: { id: true } });
    if (!agent) return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });

    const body = await request.json();
    const { isHiddenByAgent } = body as { isHiddenByAgent?: boolean };
    if (typeof isHiddenByAgent !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const property = await prisma.property.findFirst({ where: { slug, agentId: agent.id } });
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    if (!property.sourceDealId) return NextResponse.json({ error: 'Only deal properties can be toggled' }, { status: 400 });

    await prisma.property.update({ where: { id: property.id }, data: { isHiddenByAgent } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling property visibility:', error);
    return NextResponse.json({ error: 'Failed to update property visibility' }, { status: 500 });
  }
}