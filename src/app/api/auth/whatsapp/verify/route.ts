import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();
    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone and code are required' }, { status: 400 });
    }

    const hash = crypto.createHash('sha256').update(code).digest('hex');
    const tokenRecord = await prisma.verificationToken.findFirst({
      where: {
        identifier: phone,
        token: hash,
        expires: { gt: new Date() },
      },
    });

    if (!tokenRecord) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    // Do NOT consume the token here. Leave it for the NextAuth credentials provider
    // to verify and consume during the actual sign-in step.

    // Check if user is currently logged in
    const session = await getServerSession(authOptions);
    console.log('Session in verify:', session?.user?.id ? 'logged in' : 'not logged in');
    
    // Try to find user by phone first
    let user = await prisma.user.findFirst({ where: { phone } });
    console.log('User found by phone:', user?.id || 'none');
    
    if (user) {
      // User exists with this phone, update verification timestamp
      user = await prisma.user.update({ 
        where: { id: user.id }, 
        data: { phoneVerifiedAt: new Date() } 
      });
    } else if (session?.user?.id) {
      // User is logged in but doesn't have phone number - link phone to existing account
      user = await prisma.user.update({
        where: { id: session.user.id },
        data: { phone, phoneVerifiedAt: new Date() }
      });
      console.log('Linked phone to existing user:', session.user.id);
    } else {
      // Create new user with phone number (name will be collected during onboarding)
      user = await prisma.user.create({ 
        data: { phone, phoneVerifiedAt: new Date() } 
      });
    }

    // Return user info, check if user was already logged in
    return NextResponse.json({ 
      success: true, 
      userId: user.id, 
      phone, 
      code,
      wasAlreadyLoggedIn: !!session?.user?.id,
      linkedToExistingAccount: !!session?.user?.id // if session exists, it means we linked phone to existing account
    });
  } catch (error) {
    console.error('WhatsApp verify OTP error', error);
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}


