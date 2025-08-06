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
    } else {
      // For other property types, preserve existing values
      propertyData.area = existingProperty.area;
      propertyData.bedrooms = existingProperty.bedrooms;
      propertyData.bathrooms = existingProperty.bathrooms;
      
      // TODO: Add handling for other property types when implemented
      // For now, maintain existing structure
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