import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const { name, state, country, isActive } = await req.json();

    const city = await prisma.city.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(state && { state: state.trim() }),
        ...(country && { country: country.trim() }),
        ...(typeof isActive === 'boolean' && { isActive }),
      },
      include: {
        _count: {
          select: { agents: true },
        },
      },
    });

    return NextResponse.json({ city });
  } catch (error) {
    console.error('Update city error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    // Check if city has agents
    const agentCount = await prisma.agent.count({
      where: { cityId: id },
    });

    if (agentCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete city with ${agentCount} agents. Please reassign agents first.` },
        { status: 400 }
      );
    }

    await prisma.city.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete city error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
