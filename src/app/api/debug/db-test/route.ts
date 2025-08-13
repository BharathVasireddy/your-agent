import { NextResponse } from "next/server";
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Simple database connectivity test
    const userCount = await prisma.user.count();
    const agentCount = await prisma.agent.count();
    
    return NextResponse.json({
      success: true,
      database: "connected",
      userCount,
      agentCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json({
      success: false,
      database: "failed",
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}