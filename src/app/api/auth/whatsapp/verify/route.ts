import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { recordAuthEvent } from '@/lib/auth-events';

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
      await recordAuthEvent({
        request,
        type: 'OTP_VERIFY_FAILED',
        identifier: phone,
        metadata: { provider: 'whatsapp', reason: 'invalid_or_expired' },
      });
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
    }

    // Do NOT consume the token here. Leave it for the NextAuth credentials provider
    // to verify and consume during the actual sign-in step.

    // Check if user is currently logged in
    const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
    console.log('Session in verify:', (session as unknown as { user?: { id?: string } } | null)?.user?.id ? 'logged in' : 'not logged in');
    
    // Try to find user by phone first
    const userWithPhone = await prisma.user.findFirst({ where: { phone } });
    console.log('User found by phone:', userWithPhone?.id || 'none');

    if ((session as unknown as { user?: { id?: string } } | null)?.user?.id) {
      const currentUserId = (session as unknown as { user: { id: string } }).user.id;
      // If another user already owns this phone, block linking
      if (userWithPhone && userWithPhone.id !== currentUserId) {
        await recordAuthEvent({
          request,
          type: 'OTP_VERIFY_CONFLICT',
          identifier: phone,
          metadata: { provider: 'whatsapp', conflictWithUserId: userWithPhone.id },
        });
        return NextResponse.json({ error: 'This phone number is already linked to another account.' }, { status: 409 });
      }

      const updated = await prisma.user.update({
        where: { id: currentUserId },
        data: { phone, phoneVerifiedAt: new Date() },
      });

      await recordAuthEvent({
        request,
        type: 'OTP_VERIFIED',
        identifier: phone,
        userId: updated.id,
        metadata: { provider: 'whatsapp', linkedToExistingAccount: true },
      });

      return NextResponse.json({
        success: true,
        userId: updated.id,
        phone,
        wasAlreadyLoggedIn: true,
        linkedToExistingAccount: true,
      });
    }

    let user;
    if (userWithPhone) {
      // Not logged in, phone exists: refresh verification timestamp
      user = await prisma.user.update({ where: { id: userWithPhone.id }, data: { phoneVerifiedAt: new Date() } });
    } else {
      // Create new user with phone number (name will be collected during onboarding)
      user = await prisma.user.create({ data: { phone, phoneVerifiedAt: new Date() } });
    }

    // Audit successful verification
    await recordAuthEvent({
      request,
      type: 'OTP_VERIFIED',
      identifier: phone,
      userId: user.id,
      metadata: { provider: 'whatsapp', linkedToExistingAccount: !!(session as unknown as { user?: { id?: string } } | null)?.user?.id },
    });

    // Return user info, check if user was already logged in (do NOT echo OTP)
    return NextResponse.json({
      success: true,
      userId: user.id,
      phone,
      wasAlreadyLoggedIn: !!(session as unknown as { user?: { id?: string } } | null)?.user?.id,
      linkedToExistingAccount: !!(session as unknown as { user?: { id?: string } } | null)?.user?.id,
    });
  } catch (error) {
    console.error('WhatsApp verify OTP error', error);
    // Audit error
    try {
      await recordAuthEvent({
        request,
        type: 'OTP_VERIFY_ERROR',
        metadata: { provider: 'whatsapp', error: String(error).slice(0, 1000) },
      });
    } catch {}
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
}


