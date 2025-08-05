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
    const session = await getServerSession(authOptions);
    if (!session?.user) {
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

    return NextResponse.json({
      available: isAvailable,
      slug: cleanSlug,
      message: isAvailable 
        ? 'Slug is available' 
        : 'This URL is already taken. Please try another one.'
    });

  } catch (error) {
    console.error('Error checking slug:', error);
    return NextResponse.json(
      { error: 'Failed to check slug availability' },
      { status: 500 }
    );
  }
}