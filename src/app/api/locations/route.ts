import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stateId = searchParams.get('stateId');
    const districtId = searchParams.get('districtId');

    // If no filters, return all active states
    if (!stateId && !districtId) {
      const states = await prisma.state.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          code: true,
        },
        orderBy: { name: 'asc' },
      });

      return NextResponse.json({ states });
    }

    // If stateId provided, return districts in that state
    if (stateId && !districtId) {
      const districts = await prisma.district.findMany({
        where: { 
          stateId,
          isActive: true 
        },
        select: {
          id: true,
          name: true,
          stateId: true,
        },
        orderBy: { name: 'asc' },
      });

      return NextResponse.json({ districts });
    }

    // If districtId provided, return cities in that district
    if (districtId) {
      const cities = await prisma.city.findMany({
        where: { 
          districtId,
          isActive: true 
        },
        select: {
          id: true,
          name: true,
          districtId: true,
          pincode: true,
        },
        orderBy: { name: 'asc' },
      });

      return NextResponse.json({ cities });
    }

    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
  } catch (error) {
    console.error('Locations API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
