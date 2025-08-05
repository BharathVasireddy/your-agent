"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { X, LogIn } from "lucide-react";
import SignUpForm from "./SignUpForm";
import SignInForm from "./SignInForm";
import AddPasswordForm from "./AddPasswordForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "options" | "addpassword">("options");

  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
    setMode("options");
  };

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  return (
    <div className="fixed inset-0 bg-zinc-900 bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-zinc-200">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 
            className="text-xl font-semibold heading-primary"
            style={{ color: "var(--primary-red)" }}
          >
            {mode === "signin" ? "Sign In" : mode === "signup" ? "Sign Up" : mode === "addpassword" ? "Add Password" : "Get Started"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {mode === "options" && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <p 
                  className="text-body"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Choose your preferred way to continue
                </p>
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 border-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span 
                    className="px-3 bg-white text-label"
                    style={{ color: "var(--text-subtle)" }}
                  >
                    or
                  </span>
                </div>
              </div>

              {/* Email/Password Options */}
              <div className="space-y-3">
                <button
                  onClick={() => setMode("signin")}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-semibold rounded-lg transition-all duration-200 btn-primary"
                  style={{ backgroundColor: "var(--primary-red)" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--primary-red-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary-red)"}
                >
                  <LogIn size={16} />
                  Sign In with Email
                </button>

                <button
                  onClick={() => setMode("signup")}
                  className="w-full px-6 py-3 border-2 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
                >
                  Create New Account
                </button>
              </div>
            </div>
          )}

          {mode === "signin" && (
            <SignInForm
              onSuccess={handleSuccess}
              onSwitchToSignUp={() => setMode("signup")}
            />
          )}

          {mode === "signup" && (
            <SignUpForm
              onSuccess={handleSuccess}
              onSwitchToSignIn={() => setMode("signin")}
            />
          )}

          {mode === "addpassword" && (
            <AddPasswordForm
              onSuccess={handleSuccess}
              onCancel={() => setMode("options")}
            />
          )}

          {mode !== "options" && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={() => setMode("options")}
                className="text-sm text-label hover:opacity-70"
                style={{ color: "var(--text-subtle)" }}
              >
                ← Back to options
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}