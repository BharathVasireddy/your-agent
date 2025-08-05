"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, AlertCircle, Info } from "lucide-react";

interface AuthStatusCheckerProps {
  onProceed?: (email: string, authMethods: string[]) => void;
  onCancel?: () => void;
}

export default function AuthStatusChecker({ onProceed, onCancel }: AuthStatusCheckerProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<{
    exists: boolean;
    authMethods: string[];
    hasPassword: boolean;
    hasGoogle: boolean;
  } | null>(null);

  const checkEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setAuthStatus(data);
    } catch (error) {
      console.error("Email check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google");
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 
          className="text-2xl font-bold mb-2"
          style={{ 
            color: "#16A349",
            fontFamily: "Plus Jakarta Sans, sans-serif"
          }}
        >
          Check Your Account
        </h2>
        <p 
          className="text-gray-600"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Let&apos;s see what sign-in options you have
        </p>
      </div>

      <form onSubmit={checkEmail} className="space-y-6">
        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              placeholder="Enter your email"
            />
          </div>
        </div>

        {!authStatus && (
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-white font-semibold rounded-lg transition-opacity duration-200 disabled:opacity-70"
            style={{ 
              backgroundColor: "#16A349",
              fontFamily: "Plus Jakarta Sans, sans-serif"
            }}
          >
            {isLoading ? "Checking..." : "Check Account"}
          </button>
        )}
      </form>

      {authStatus && (
        <div className="mt-6 space-y-4">
          {!authStatus.exists ? (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <div className="flex items-start">
                <Info className="text-blue-600 mr-3 mt-0.5" size={20} />
                <div>
                  <h4 className="font-semibold text-blue-800" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                    New Email
                  </h4>
                  <p className="text-blue-700 text-sm" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                    This email isn&apos;t registered yet. You can create a new account.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onProceed?.(email, [])}
                className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg font-medium"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                Create Account
              </button>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="text-green-600 mr-3 mt-0.5" size={20} />
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                    Account Found!
                  </h4>
                  <p className="text-green-700 text-sm mb-3" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                    Here are your available sign-in options:
                  </p>
                  
                  <div className="space-y-2">
                    {authStatus.hasGoogle && (
                      <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </button>
                    )}
                    
                    {authStatus.hasPassword && (
                      <button
                        onClick={() => onProceed?.(email, authStatus.authMethods)}
                        className="w-full py-2 text-white rounded-lg font-medium"
                        style={{ 
                          backgroundColor: "#16A349",
                          fontFamily: "Plus Jakarta Sans, sans-serif"
                        }}
                      >
                        Sign In with Password
                      </button>
                    )}
                    
                    {!authStatus.hasPassword && authStatus.hasGoogle && (
                      <button
                        onClick={() => onProceed?.(email, ["add-password"])}
                        className="w-full py-2 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50"
                        style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                      >
                        Add Password to Account
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={onCancel}
            className="w-full py-2 text-gray-600 font-medium"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}