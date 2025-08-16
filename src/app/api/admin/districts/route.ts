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
    const stateId = searchParams.get('stateId');

    const where = stateId ? { stateId } : {};

    const districts = await prisma.district.findMany({
      where,
      include: {
        state: true,
        cities: {
          where: { isActive: true },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: { agents: true, cities: true },
        },
      },
      orderBy: [{ state: { name: 'asc' } }, { name: 'asc' }],
    });

    return NextResponse.json({ districts });
  } catch (error) {
    console.error('Districts API error:', error);
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

    const { name, stateId } = await req.json();

    if (!name || !stateId) {
      return NextResponse.json(
        { error: 'Name and state are required' },
        { status: 400 }
      );
    }

    const district = await prisma.district.create({
      data: {
        name: name.trim(),
        stateId,
      },
      include: {
        state: true,
        _count: {
          select: { agents: true, cities: true },
        },
      },
    });

    return NextResponse.json({ district });
  } catch (error) {
    console.error('Create district error:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'District already exists in this state' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
