"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LogIn, LogOut, User } from "lucide-react";
import Image from "next/image";
import AuthModal from "./AuthModal";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Loading state - pulsing gray placeholder
  if (status === "loading") {
    return (
      <div className="animate-pulse bg-gray-200 rounded-lg h-10 w-32"></div>
    );
  }

  // Authenticated state - show user image and sign out button
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
        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
          style={{ 
            borderColor: "var(--border-color)",
            color: "var(--text-secondary)"
          }}
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    );
  }

  // Not authenticated state - show sign in button
  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className="flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-all duration-200 font-semibold btn-primary"
        style={{ backgroundColor: "var(--primary-red)" }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-red-hover)"}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-red)"}
      >
        <LogIn size={16} />
        Get Started
      </button>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}