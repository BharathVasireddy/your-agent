import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, context: unknown) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = (context as { params: { id: string } }).params;
    const { name, isActive } = await req.json();

    const updateData: { name?: string; isActive?: boolean } = {};
    if (name) updateData.name = name.trim();
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const district = await prisma.district.update({
      where: { id },
      data: updateData,
      include: {
        state: true,
        _count: {
          select: { agents: true, cities: true },
        },
      },
    });

    return NextResponse.json({ district });
  } catch (error) {
    console.error('Update district error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: unknown) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = (context as { params: { id: string } }).params;

    // Check if district has agents or cities
    const agentCount = await prisma.agent.count({
      where: { districtId: id },
    });

    const cityCount = await prisma.city.count({
      where: { districtId: id },
    });

    if (agentCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete district. ${agentCount} agents are assigned to this district.` },
        { status: 400 }
      );
    }

    if (cityCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete district. ${cityCount} cities exist in this district.` },
        { status: 400 }
      );
    }

    await prisma.district.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete district error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
