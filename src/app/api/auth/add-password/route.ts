import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Get the current session to ensure user is authenticated
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "You must be signed in to add a password" },
        { status: 401 }
      );
    }

    const { password } = await request.json();

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.password) {
      return NextResponse.json(
        { error: "Account already has a password. Use change password instead." },
        { status: 400 }
      );
    }

    // Hash and add password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json(
      { message: "Password added successfully! You can now sign in with email and password." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Add password error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}