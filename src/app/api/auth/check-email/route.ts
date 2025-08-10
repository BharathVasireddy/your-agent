// Keep endpoint minimal now that credentials are removed
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email }, include: { accounts: true } });
    if (!user) return NextResponse.json({ exists: false, authMethods: [] });

    const hasGoogle = user.accounts.some(acc => acc.provider === "google");
    return NextResponse.json({ exists: true, authMethods: hasGoogle ? ["google"] : [], hasGoogle });
  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}