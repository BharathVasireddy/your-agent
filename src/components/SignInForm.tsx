"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

interface SignInFormProps {
  onSuccess?: () => void;
  onSwitchToSignUp?: () => void;
}

export default function SignInForm({ onSuccess, onSwitchToSignUp }: SignInFormProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        onSuccess?.();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 
          className="text-2xl font-semibold mb-2 heading-primary"
          style={{ color: "var(--primary-red)" }}
        >
          Welcome Back
        </h2>
        <p 
          className="text-body"
          style={{ color: "var(--text-secondary)" }}
        >
          Sign in to your account
        </p>
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
          className="w-full py-3 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-70 btn-primary"
          style={{ backgroundColor: "var(--primary-red)" }}
          onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "var(--primary-red-hover)")}
          onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "var(--primary-red)")}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        <div className="text-center">
          <span 
            className="text-gray-600"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Don&apos;t have an account?{" "}
          </span>
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="font-semibold hover:underline"
            style={{ color: "var(--primary-red)" }}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}