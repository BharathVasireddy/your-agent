import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

function generateSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
    if (!(session as unknown as { user?: unknown } | null)?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug: rawSlug } = await request.json();

    if (!rawSlug || typeof rawSlug !== 'string') {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // Clean and format the slug
    const cleanSlug = generateSlug(rawSlug);

    if (!cleanSlug) {
      return NextResponse.json({ 
        available: false, 
        slug: cleanSlug,
        message: 'Slug must contain at least one letter or number' 
      });
    }

    if (cleanSlug.length < 3) {
      return NextResponse.json({ 
        available: false, 
        slug: cleanSlug,
        message: 'Slug must be at least 3 characters long' 
      });
    }

    if (cleanSlug.length > 50) {
      return NextResponse.json({ 
        available: false, 
        slug: cleanSlug,
        message: 'Slug must be less than 50 characters' 
      });
    }

    // Check if slug is already taken
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentUserId = (session as any).user.id as string;
    
    const existingAgent = await prisma.agent.findUnique({
      where: { slug: cleanSlug },
      select: { userId: true }
    });

    const isAvailable = !existingAgent || existingAgent.userId === currentUserId;

    if (isAvailable) {
      return NextResponse.json({
        available: true,
        slug: cleanSlug,
        message: 'Slug is available'
      });
    }

    // Generate alternative suggestions if slug is taken
    let suggestedSlug = cleanSlug;
    let counter = 1;
    let foundAvailable = false;

    // Try up to 10 alternatives
    while (!foundAvailable && counter <= 10) {
      const candidateSlug = `${cleanSlug}-${counter}`;
      
      const existingCandidate = await prisma.agent.findUnique({
        where: { slug: candidateSlug },
        select: { userId: true }
      });

      if (!existingCandidate || existingCandidate.userId === currentUserId) {
        suggestedSlug = candidateSlug;
        foundAvailable = true;
      } else {
        counter++;
      }
    }

    // If we couldn't find an alternative with numbers, try with random suffix
    if (!foundAvailable) {
      const randomSuffix = Math.floor(Math.random() * 9999);
      suggestedSlug = `${cleanSlug}-${randomSuffix}`;
    }

    return NextResponse.json({
      available: false,
      slug: suggestedSlug,
      originalSlug: cleanSlug,
      message: `"${cleanSlug}" is already taken. We suggest "${suggestedSlug}" instead.`
    });

  } catch (error) {
    console.error('Error checking slug:', error);
    return NextResponse.json(
      { error: 'Failed to check slug availability' },
      { status: 500 }
    );
  }
}