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

    const states = await prisma.state.findMany({
      include: {
        districts: {
          where: { isActive: true },
          include: {
            cities: {
              where: { isActive: true },
              orderBy: { name: 'asc' },
            },
          },
          orderBy: { name: 'asc' },
        },
        _count: {
          select: { agents: true, districts: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ states });
  } catch (error) {
    console.error('States API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, isActive } = await req.json();

    if (!id || typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: 'State ID and active status are required' },
        { status: 400 }
      );
    }

    const state = await prisma.state.update({
      where: { id },
      data: { isActive },
      include: {
        _count: {
          select: { agents: true, districts: true },
        },
      },
    });

    return NextResponse.json({ state });
  } catch (error) {
    console.error('Update state error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
