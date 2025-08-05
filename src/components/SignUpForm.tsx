"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

interface SignUpFormProps {
  onSuccess?: () => void;
  onSwitchToSignIn?: () => void;
}

export default function SignUpForm({ onSuccess, onSwitchToSignIn }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    name: "",
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
      // Register user
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases with better UX
        if (data.canAddPassword && data.existingMethods?.includes("google")) {
          setError("You already have an account with Google. Would you like to add a password to your existing account instead?");
        } else {
          setError(data.error || "Something went wrong");
        }
        return;
      }

      // Auto sign in after successful registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Registration successful but sign in failed. Please try signing in manually.");
      } else {
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
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
          Create Account
        </h2>
        <p 
          className="text-body"
          style={{ color: "var(--text-secondary)" }}
        >
          Join YourAgent.in today
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
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              placeholder="Enter your full name"
            />
          </div>
        </div>

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
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
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
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              placeholder="Create a password"
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}>
            Must be at least 6 characters long
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-70 btn-primary"
          style={{ backgroundColor: "var(--primary-red)" }}
          onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "var(--primary-red-hover)")}
          onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "var(--primary-red)")}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="text-center">
          <span 
            className="text-gray-600"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Already have an account?{" "}
          </span>
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="font-semibold hover:underline"
            style={{ color: "var(--primary-red)" }}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
}