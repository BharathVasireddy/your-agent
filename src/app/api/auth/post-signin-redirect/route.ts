import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserFlowStatus } from '@/lib/userFlow';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Get user flow status to determine where to redirect
    const flowStatus = await getUserFlowStatus();
    
    // Redirect based on user's needs
    const redirectUrl = new URL(flowStatus.redirectTo, request.url);
    return NextResponse.redirect(redirectUrl);
    
  } catch (error) {
    console.error("Post-signin redirect error:", error);
    // Fallback to welcome page on error
    return NextResponse.redirect(new URL('/onboarding/welcome', request.url));
  }
}
