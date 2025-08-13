import { NextResponse } from "next/server";

export async function GET() {
  try {
    const googleId = process.env.AUTH_GOOGLE_ID;
    const googleSecret = process.env.AUTH_GOOGLE_SECRET;
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const nextAuthSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
    
    return NextResponse.json({
      success: true,
      config: {
        googleId: googleId ? `${googleId.slice(0, 10)}...` : 'MISSING',
        googleSecret: googleSecret ? 'SET' : 'MISSING',
        nextAuthUrl: nextAuthUrl || 'MISSING',
        nextAuthSecret: nextAuthSecret ? 'SET' : 'MISSING',
        nodeEnv: process.env.NODE_ENV,
        primaryDomain: process.env.PRIMARY_DOMAIN || 'MISSING'
      },
      callbackUrl: `${nextAuthUrl}/api/auth/callback/google`
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}