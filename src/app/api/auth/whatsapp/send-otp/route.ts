import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import crypto from 'crypto';

function generateOtp(length = 6) {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) code += digits[Math.floor(Math.random() * 10)];
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone || typeof phone !== 'string') {
      return NextResponse.json({ error: 'Phone is required' }, { status: 400 });
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
      return NextResponse.json({ error: 'WhatsApp send failed', details: err }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('WhatsApp send OTP error', error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}


