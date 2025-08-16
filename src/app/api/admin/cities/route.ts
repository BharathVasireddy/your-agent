import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const districtId = searchParams.get('districtId');

    const where = districtId ? { districtId } : {};

    const cities = await prisma.city.findMany({
      where,
      include: {
        district: {
          include: {
            state: true,
          },
        },
        _count: {
          select: { agents: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ cities });
  } catch (error) {
    console.error('Cities API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, districtId, pincode } = await req.json();

    if (!name || !districtId) {
      return NextResponse.json(
        { error: 'Name and district are required' },
        { status: 400 }
      );
    }

    const city = await prisma.city.create({
      data: {
        name: name.trim(),
        districtId,
        pincode: pincode?.trim() || null,
      },
      include: {
        district: {
          include: {
            state: true,
          },
        },
        _count: {
          select: { agents: true },
        },
      },
    });

    return NextResponse.json({ city });
  } catch (error) {
    console.error('Create city error:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'City already exists' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
