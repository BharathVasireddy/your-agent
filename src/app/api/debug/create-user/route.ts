import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Get session to verify authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'Not authenticated' 
      }, { status: 401 });
    }

    // Get the user data from request body
    const userData = await request.json();
    
    // Validate required fields
    if (!userData.id || !userData.email) {
      return NextResponse.json({ 
        error: 'Missing required fields: id and email' 
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userData.id }
    });

    if (existingUser) {
      return NextResponse.json({
        message: 'User already exists in database',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        }
      });
    }

    // Create the missing user record
    const newUser = await prisma.user.create({
      data: {
        id: userData.id,
        email: userData.email,
        name: userData.name || null,
        image: userData.image || null,
        emailVerified: new Date(), // Set as verified since they're already authenticated
      }
    });

    return NextResponse.json({
      message: 'User record created successfully! You can now use grantSubscription.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      }
    });

  } catch (error) {
    console.error('Create user API error:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json({ 
          error: 'User with this email already exists',
          details: error.message
        }, { status: 409 });
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to create user record',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}