"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { grantSubscription } from "@/app/actions";
import { CheckCircle, XCircle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DevGrantSubscriptionPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Lock className="mx-auto h-12 w-12 text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-lg text-gray-600">This page is only available in development.</p>
        </div>
      </div>
    );
  }

  const handleGrantSubscription = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    setMessage("");

    try {
      const result = await grantSubscription();
      setMessage(`Success! ${result.message}`);
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        router.push('/agent/dashboard');
      }, 2000);
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Dev Grant Subscription</h1>
          <p className="text-lg text-gray-600">Please log in first.</p>
        </div>
      </div>
    );
  }

  // Authenticated
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dev: Grant Subscription</h1>
          <p className="text-gray-600 mb-6">
            Welcome, {session.user?.name || session.user?.email}!
          </p>
          <p className="text-sm text-gray-500 mb-6">
            This development tool will grant you a subscription and redirect you to the dashboard.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleGrantSubscription}
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            }`}
            style={{ 
              backgroundColor: isLoading ? undefined : "var(--primary-red)",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "var(--primary-red-hover)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = "var(--primary-red)";
              }
            }}
          >
            {isLoading ? "Granting Subscription..." : "Grant Subscription & Access Dashboard"}
          </button>

          {message && (
            <div className={`p-4 rounded-md flex items-center gap-2 ${
              message.startsWith("Success") 
                ? "bg-green-50 text-green-800 border border-green-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message.startsWith("Success") ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <XCircle size={16} className="text-red-600" />
              )}
              {message}
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            User: {session.user?.name || session.user?.email}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Development environment only
          </p>
        </div>
      </div>
    </div>
  );
}