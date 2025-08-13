import { NextResponse } from "next/server";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    let dbStatus = 'unknown';
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch (dbError) {
      dbStatus = `failed: ${String(dbError).slice(0, 100)}`;
    }

    // Test PrismaAdapter creation
    let adapterStatus = 'unknown';
    try {
      const adapter = PrismaAdapter(prisma);
      adapterStatus = 'created successfully';
    } catch (adapterError) {
      adapterStatus = `failed: ${String(adapterError).slice(0, 100)}`;
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        hasAuthSecret: !!process.env.AUTH_SECRET,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasGoogleId: !!process.env.AUTH_GOOGLE_ID,
        hasGoogleSecret: !!process.env.AUTH_GOOGLE_SECRET,
        hasPrimaryDomain: !!process.env.PRIMARY_DOMAIN,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
      },
      database: {
        status: dbStatus
      },
      adapter: {
        status: adapterStatus
      }
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Configuration check failed',
      details: String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}