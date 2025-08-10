// Credentials registration is disabled. Use Google or WhatsApp flows.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Email/password registration is disabled. Please use Google or WhatsApp to continue." },
    { status: 405 }
  );
}