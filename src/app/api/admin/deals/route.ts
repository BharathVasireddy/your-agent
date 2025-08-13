import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const status = (searchParams.get('status') || '').trim();
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('pageSize') || '20')));

  const where: NonNullable<Parameters<typeof prisma.deal.findMany>[0]>['where'] = {
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { location: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    deletedAt: null,
  };

  const [total, items] = await Promise.all([
    prisma.deal.count({ where }),
    prisma.deal.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return NextResponse.json({ total, page, pageSize, items });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const {
    title,
    description,
    price,
    agentEarningAmount,
    listingType,
    propertyType,
    location,
    amenities,
    photos,
    brochureUrl,
    propertyData,
    minPageViewsLast30d,
    minProfileViewsLast30d,
    allowedCities = [],
    allowedAreas = [],
    allowedAgentSlugs = [],
    excludedCities = [],
    excludedAreas = [],
    excludedAgentSlugs = [],
  } = body;

  const baseSlug = (title || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '');
  let slug = baseSlug || 'deal';
  let c = 1;
  while (await prisma.deal.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${c++}`;
  }

  const created = await prisma.deal.create({
    data: {
      slug,
      title,
      description,
      price,
      agentEarningAmount,
      listingType,
      propertyType,
      location,
      amenities,
      photos,
      brochureUrl,
      propertyData: propertyData as Prisma.InputJsonValue | undefined,
      minPageViewsLast30d,
      minProfileViewsLast30d,
      allowedCities,
      allowedAreas,
      allowedAgentSlugs,
      excludedCities,
      excludedAreas,
      excludedAgentSlugs,
    },
  });

  return NextResponse.json({ deal: created });
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const updated = await prisma.deal.update({ where: { id }, data: updates });

  // Propagate key fields to adopted properties if content changed or status changed
  if (updates.status) {
    if (updates.status === 'Sold' || updates.status === 'Inactive') {
      await prisma.property.updateMany({ where: { sourceDealId: id }, data: { status: updates.status === 'Sold' ? 'Sold' : 'Inactive' } });
    } else if (updates.status === 'Active') {
      await prisma.property.updateMany({ where: { sourceDealId: id }, data: { status: 'Available' } });
    }
  }

  // If content fields changed, sync them to properties (except agent-controlled flags, slug)
  const syncFields: (keyof typeof updates)[] = ['title','description','price','listingType','propertyType','location','amenities','photos','brochureUrl','propertyData'];
  const needsSync = syncFields.some(f => Object.prototype.hasOwnProperty.call(updates, f));
  if (needsSync) {
    await prisma.property.updateMany({
      where: { sourceDealId: id },
      data: {
        title: updates.title as string | undefined,
        description: updates.description as string | undefined,
        price: updates.price as number | undefined,
        listingType: updates.listingType as string | undefined,
        propertyType: updates.propertyType as string | undefined,
        location: updates.location as string | undefined,
        amenities: updates.amenities as string[] | undefined,
        photos: updates.photos as string[] | undefined,
        brochureUrl: updates.brochureUrl as string | undefined,
        propertyData: updates.propertyData as Prisma.InputJsonValue | undefined,
      },
    });
  }

  return NextResponse.json({ deal: updated });
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await prisma.deal.update({ where: { id }, data: { deletedAt: new Date(), status: 'Inactive' } });
  await prisma.property.updateMany({ where: { sourceDealId: id }, data: { status: 'Inactive' } });

  return NextResponse.json({ success: true });
}


