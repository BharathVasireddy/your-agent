import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const simpleAuth = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  debug: true,
});

export async function GET(request: Request) {
  try {
    return NextResponse.json({
      message: "Auth test endpoint",
      env: {
        googleId: process.env.AUTH_GOOGLE_ID ? 'SET' : 'MISSING',
        googleSecret: process.env.AUTH_GOOGLE_SECRET ? 'SET' : 'MISSING',
        authSecret: process.env.AUTH_SECRET ? 'SET' : 'MISSING',
        nextAuthUrl: process.env.NEXTAUTH_URL || 'MISSING',
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: String(error)
    }, { status: 500 });
  }
}