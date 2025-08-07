"use client";

import { useSession } from "next-auth/react";
import { LogIn, User, LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginButton() {
  const { data: session, status } = useSession();

  // Loading state - pulsing gray placeholder
  if (status === "loading") {
    return (
      <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-32"></div>
    );
  }

  // Authenticated state - show user image and dashboard button
  if (session) {
    return (
      <div className="flex items-center gap-3">
        {session.user?.image ? (
          <Image
            src={session.user.image}
            alt="User avatar"
            width={32}
            height={32}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={16} className="text-gray-500" />
          </div>
        )}
        <Link
          href="/agent/dashboard"
          className="flex items-center gap-2 text-white transition-all duration-200 font-medium btn-primary btn-lg"
          style={{ backgroundColor: "var(--primary-red)" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-red-hover)"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-red)"}
        >
          <LayoutDashboard size={16} />
          Go to Dashboard
        </Link>
      </div>
    );
  }

  // Not authenticated state - show sign in button
  return (
    <>
      <Link
        href="/login"
        className="flex items-center gap-2 text-white transition-all duration-200 font-medium btn-primary btn-lg"
        style={{ backgroundColor: "var(--primary-red)" }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-red-hover)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-red)"}
      >
        <LogIn size={16} />
        Get Started
      </Link>
    </>
  );
}