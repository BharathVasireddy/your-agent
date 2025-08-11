"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

interface AddPasswordFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddPasswordForm({ onSuccess, onCancel }: AddPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/add-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full text-center p-8">
        <CheckCircle size={48} className="mx-auto mb-4" style={{ color: "var(--primary-red)" }} />
        <h3 
          className="text-xl font-semibold mb-2 heading-primary"
          style={{ color: "var(--primary-red)" }}
        >
          Password Added Successfully!
        </h3>
        <p 
          className="text-body"
          style={{ color: "var(--text-secondary)" }}
        >
          You can now sign in with your email and password.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 
          className="text-2xl font-semibold mb-2 heading-primary"
          style={{ color: "var(--primary-red)" }}
        >
          Add Password
        </h2>
        <p 
          className="text-body"
          style={{ color: "var(--text-secondary)" }}
        >
          Add a password to your Google account for more sign-in options
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-brand-light border border-brand-soft text-brand px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
        </div>

        <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showConfirmPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              placeholder="Confirm your password"
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-70 btn-primary"
            style={{ backgroundColor: "var(--primary-red)" }}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "var(--primary-red-hover)")}
            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.backgroundColor = "var(--primary-red)")}
          >
            {isLoading ? "Adding Password..." : "Add Password"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full py-3 border-2 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
            style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}