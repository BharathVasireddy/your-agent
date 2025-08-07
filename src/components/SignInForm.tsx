"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignInFormProps {
  onSuccess?: () => void;
}

export default function SignInForm({ onSuccess }: SignInFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isGoogleOnlyAccount, setIsGoogleOnlyAccount] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setIsGoogleOnlyAccount(false);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        // For any credential sign-in error, check if it's a Google-only account
        if (result.error === "CredentialsSignin" || result.error === "GOOGLE_ONLY_ACCOUNT") {
          // Check if this is a Google-only account
          try {
            const checkResponse = await fetch("/api/auth/check-email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: formData.email }),
            });
            
            if (checkResponse.ok) {
              const checkData = await checkResponse.json();
              if (checkData.exists && checkData.hasGoogle && !checkData.hasPassword) {
                setError("This email is associated with a Google account. Please use 'Continue with Google' to sign in.");
                setIsGoogleOnlyAccount(true);
                return;
              }
            }
          } catch {
            // If check fails, fall back to generic error
          }
        }
        setError("Invalid email or password");
      } else {
        if (onSuccess) {
          onSuccess();
        } else {
          // Navigate to appropriate page after login
          router.push('/agent/dashboard');
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: '/api/auth/post-signin-redirect' });
  };

  return (
    <div className="w-full">
      {/* Google Sign In */}
      <div className="mb-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className={`w-full border-2 hover:bg-gray-50 btn-lg transition-all duration-200 ${
            isGoogleOnlyAccount 
              ? 'border-red-300 bg-red-50 hover:bg-red-100 ring-2 ring-red-200' 
              : ''
          }`}
          style={{ 
            borderColor: isGoogleOnlyAccount ? "#fca5a5" : "var(--border-color)"
          }}
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white text-zinc-500">or</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent input-lg input-with-left-icon"
                          style={{ borderColor: "var(--border-color)" }}
            placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent input-lg input-with-both-icons"
                          style={{ borderColor: "var(--border-color)" }}
            placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full text-white font-semibold transition-all duration-200 disabled:opacity-70 btn-primary btn-lg"
          style={{ backgroundColor: "var(--primary-red)" }}
          onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "var(--primary-red-hover)")}
          onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "var(--primary-red)")}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        {/* Forgot Password Link */}
        <div className="text-center">
          <Link
            href="/reset-password"
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Forgot your password?
          </Link>
        </div>

      </form>
    </div>
  );
}