"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function FixUserPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleCreateUser = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/debug/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: (session as any).user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Success! ${result.message}`);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckUserExists = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/debug/session');
      const result = await response.json();

      if (result.debug.userFound) {
        setMessage("✅ User exists in database! The issue might be elsewhere.");
      } else {
        setMessage("❌ User not found in database. Click 'Create Missing User Record' to fix this.");
      }
    } catch (error) {
      setMessage(`Error checking user: ${error instanceof Error ? error.message : "Something went wrong"}`);
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
          <h1 className="text-2xl font-bold text-gray-900">Fix User Record</h1>
          <p className="text-lg text-gray-600">Please log in first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fix User Record</h1>
          <p className="text-gray-600 mb-6">
            This tool fixes the foreign key constraint error by creating the missing User record.
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Current Session Info</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p><strong>User ID:</strong> {(session as any).user.id}</p>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Name:</strong> {session.user.name}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleCheckUserExists}
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Checking..." : "Check if User Exists in Database"}
          </button>

          <button
            onClick={handleCreateUser}
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            }`}
          >
            {isLoading ? "Creating..." : "Create Missing User Record"}
          </button>

          {message && (
            <div className={`p-4 rounded-md flex items-center gap-2 ${
              message.startsWith("Success") || message.startsWith("✅")
                ? "bg-green-50 text-green-800 border border-green-200" 
                : message.startsWith("❌")
                ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}>
              {message.startsWith("Success") || message.startsWith("✅") ? (
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
            This tool creates a User record matching your session data to fix the foreign key constraint.
          </p>
        </div>
      </div>
    </div>
  );
}