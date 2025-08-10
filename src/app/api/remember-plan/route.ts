import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get('plan');
  const interval = searchParams.get('interval');

  const res = NextResponse.redirect(new URL('/subscribe', request.url));
  if (plan && interval) {
    // Short-lived cookie to remember selection through auth/onboarding
    res.cookies.set('selectedPlan', JSON.stringify({ plan, interval }), {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    });
  }

  // If not logged in, it's OK; /subscribe will send to /login while keeping the cookie
  // If logged in, user will see subscribe or be redirected by flow as usual
  // We don't branch to /login here to keep a single landing path
  const session = await getServerSession(authOptions);
  void session; // no-op
  return res;
}


