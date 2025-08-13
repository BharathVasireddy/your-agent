import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
  if (!(session as unknown as { user?: unknown } | null)?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;
  const { id } = await params;

  const agent = await prisma.agent.findUnique({ where: { userId } });
  if (!agent) return NextResponse.json({ error: 'Agent profile not found' }, { status: 404 });

  const deal = await prisma.deal.findFirst({ where: { id, deletedAt: null } });
  if (!deal || deal.status !== 'Active') return NextResponse.json({ error: 'Deal not available' }, { status: 404 });

  // Prevent duplicate adoption
  const existing = await prisma.property.findFirst({ where: { agentId: agent.id, sourceDealId: id } });
  if (existing) return NextResponse.json({ error: 'Already added' }, { status: 409 });

  // Create slug as name + unique property id (post-create to get id)
  const created = await prisma.property.create({
    data: {
      agentId: agent.id,
      title: deal.title,
      description: deal.description,
      price: deal.price,
      location: deal.location,
      amenities: deal.amenities,
      photos: deal.photos,
      status: 'Available',
      listingType: deal.listingType,
      propertyType: deal.propertyType,
      brochureUrl: deal.brochureUrl || null,
      propertyData: deal.propertyData as Prisma.InputJsonValue | undefined,
      sourceDealId: deal.id,
      isHiddenByAgent: false,
      adoptedAt: new Date(),
    },
  });

  // Generate slug using name + short id
  const baseSlug = (deal.title || 'property').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  const shortId = created.id.slice(0, 6);
  let finalSlug = `${baseSlug}-${shortId}`;
  let c = 1;
  while (await prisma.property.findUnique({ where: { slug: finalSlug } })) {
    finalSlug = `${baseSlug}-${shortId}-${c++}`;
  }

  await prisma.property.update({ where: { id: created.id }, data: { slug: finalSlug } });

  return NextResponse.json({ success: true, slug: finalSlug });
}


