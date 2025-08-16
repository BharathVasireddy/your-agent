import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto, { randomInt } from 'crypto';
import { recordAuthEvent } from '@/lib/auth-events';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

function generateOtp(length = 6) {
  // Use crypto.randomInt for cryptographically secure OTP
  const max = 10 ** length;
  const num = randomInt(0, max);
  return String(num).padStart(length, '0');
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
    }

    // Get current session to check if user is logged in
    const session = await getServerSession(authOptions);
    
    // Check if phone number already exists
    const existingUser = await prisma.user.findFirst({
      where: { phone },
    });

    if (existingUser) {
      // If user is logged in and trying to link the same number they already own, allow it
      const currentUserId = (session?.user as unknown as { id?: string })?.id;
      if (currentUserId && existingUser.id === currentUserId) {
        // Same user re-verifying their own number - proceed
      } else {
        // Phone belongs to different user or user is not logged in - conflict
        await recordAuthEvent({
          request,
          type: 'OTP_SEND_CONFLICT',
          identifier: phone,
          metadata: { 
            provider: 'whatsapp', 
            reason: 'phone_already_registered',
            existingUserId: existingUser.id,
            currentUserId: currentUserId || null
          },
        });
        return NextResponse.json({ 
          error: 'This phone number is already registered with another account. Please sign in with your existing account first, or use a different phone number to create a new account.' 
        }, { status: 409 });
      }
    }

    // Clear previous OTPs for this phone to avoid accidental throttling during testing
    await prisma.verificationToken.deleteMany({ where: { identifier: phone } });

    const code = generateOtp(6);
    const hash = crypto.createHash('sha256').update(code).digest('hex');
    const expires = new Date(Date.now() + 5 * 60 * 1000);

    // Store hashed OTP in VerificationToken (reuse table)
    await prisma.verificationToken.create({
      data: {
        identifier: phone,
        token: hash,
        expires,
      },
    });

    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;
    const template = process.env.WHATSAPP_TEMPLATE || 'otp';
    const lang = process.env.WHATSAPP_TEMPLATE_LANG || 'en_US';

    if (!token || !phoneId) {
      return NextResponse.json({ error: 'WhatsApp credentials not configured' }, { status: 500 });
    }

    // Send via WhatsApp Cloud API
    // WhatsApp Cloud API requires E.164 digits only (no '+')
    const to = phone.replace(/\D/g, '');

    const waRes = await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: template,
          language: { code: lang },
          components: [
            { type: 'body', parameters: [{ type: 'text', text: code }] },
            { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: code }] },
          ],
        },
      }),
    });

    if (!waRes.ok) {
      const err = await waRes.text();
      console.error('WhatsApp API error', err);
      // Audit failed OTP send
      await recordAuthEvent({
        request,
        type: 'OTP_SEND_FAILED',
        identifier: phone,
        metadata: { provider: 'whatsapp', error: err?.slice(0, 1000) },
      });
      return NextResponse.json({ error: 'WhatsApp send failed' }, { status: 502 });
    }

    // Audit successful OTP send
    await recordAuthEvent({
      request,
      type: 'OTP_SENT',
      identifier: phone,
      metadata: { provider: 'whatsapp' },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WhatsApp send OTP error', error);
    // Audit server error
    try {
      await recordAuthEvent({
        request,
        type: 'OTP_SEND_ERROR',
        metadata: { provider: 'whatsapp', error: String(error).slice(0, 1000) },
      });
    } catch {}
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}


