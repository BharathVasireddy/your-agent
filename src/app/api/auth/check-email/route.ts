import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists and what auth methods they have
    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: true }
    });

    if (!user) {
      return NextResponse.json({
        exists: false,
        authMethods: []
      });
    }

    const authMethods: string[] = [];
    
    // Check if they have a password (email/password auth)
    if (user.password) {
      authMethods.push("credentials");
    }
    
    // Check what OAuth providers they've used
    user.accounts.forEach(account => {
      if (!authMethods.includes(account.provider)) {
        authMethods.push(account.provider);
      }
    });

    return NextResponse.json({
      exists: true,
      authMethods,
      hasPassword: !!user.password,
      hasGoogle: user.accounts.some(acc => acc.provider === "google")
    });

  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}