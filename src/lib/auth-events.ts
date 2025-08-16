import prisma from '@/lib/prisma';
import type { NextRequest } from 'next/server';

type AuthEventType =
  | 'OTP_SENT'
  | 'OTP_SEND_FAILED'
  | 'OTP_SEND_CONFLICT'
  | 'OTP_SEND_ERROR'
  | 'OTP_VERIFIED'
  | 'OTP_VERIFY_FAILED'
  | 'OTP_VERIFY_CONFLICT'
  | 'OTP_VERIFY_ERROR'
  | 'SIGNIN_SUCCESS'
  | 'SIGNIN_FAILED'
  | 'USER_CREATED';

interface RecordAuthEventInput {
  request?: NextRequest;
  type: AuthEventType;
  userId?: string;
  identifier?: string; // email or phone
  metadata?: Record<string, unknown>;
}

export async function recordAuthEvent(input: RecordAuthEventInput): Promise<void> {
  try {
    const ipHeader = input.request?.headers.get('x-forwarded-for');
    const ipAddress = ipHeader ? ipHeader.split(',')[0]?.trim() : null;
    const userAgent = input.request?.headers.get('user-agent') || null;

    await prisma.authEvent.create({
      data: {
        type: input.type,
        userId: input.userId || null,
        identifier: input.identifier || null,
        ipAddress,
        userAgent,
        // Prisma expects InputJsonValue; coerce via JSON.parse/stringify to guarantee serializable object
        metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : {},
      },
    });
  } catch (error) {
    // Avoid throwing from logging; just swallow
    console.error('recordAuthEvent failed', error);
  }
}


