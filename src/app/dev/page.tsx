"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import { makeSubscribedAgent } from "./actions";

export default function DevPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleMakeSubscribed = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session?.user || !(session.user as any).id) return;

    setIsLoading(true);
    setMessage("");

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await makeSubscribedAgent((session.user as any).id);
      
      if (result.success) {
        setMessage(`✅ Success! Agent profile updated. ${result.message}`);
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
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
          <h1 className="text-2xl font-bold text-gray-900">Dev Page</h1>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dev Page</h1>
          <p className="text-gray-600 mb-6">
            Welcome, {session.user?.name || session.user?.email}!
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleMakeSubscribed}
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
            {isLoading ? "Processing..." : "Make Me a Subscribed Agent"}
          </button>

          {message && (
            <div className={`p-4 rounded-md ${
              message.startsWith("✅") 
                ? "bg-green-50 text-green-800 border border-green-200" 
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message}
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            User ID: {(session.user as any).id}
          </p>
        </div>
      </div>
    </div>
  );
}