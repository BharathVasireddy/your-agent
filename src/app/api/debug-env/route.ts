import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'MISSING',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL ? 'SET' : 'MISSING',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
    AUTH_SECRET: process.env.AUTH_SECRET ? 'SET' : 'MISSING',
    PRIMARY_DOMAIN: process.env.PRIMARY_DOMAIN ? 'SET' : 'MISSING',
    NODE_ENV: process.env.NODE_ENV || 'MISSING',
    // Show first 20 chars of DATABASE_URL if it exists (for debugging)
    DATABASE_URL_PREFIX: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'MISSING'
  };
  
  return NextResponse.json(envVars);
}