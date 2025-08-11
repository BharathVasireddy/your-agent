"use client";

import { useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, Users } from "lucide-react";

export default function BulkFixUsersPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [auditResults, setAuditResults] = useState<{orphanedAgents: Array<{id: string; slug: string; userId: string; isSubscribed: boolean}>} | null>(null);

  const handleAuditOrphanedAgents = async () => {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/debug/audit-orphaned');
      const result = await response.json();

      if (response.ok) {
        setAuditResults(result);
        setMessage(`Found ${result.orphanedAgents.length} orphaned agents. Review the list below.`);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkCreateUsers = async () => {
    if (!auditResults?.orphanedAgents?.length) {
      setMessage("No orphaned agents found. Run audit first.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch('/api/debug/bulk-create-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orphanedAgents: auditResults.orphanedAgents
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Success! Created ${result.created} user records, skipped ${result.skipped} existing ones.`);
        // Refresh audit results
        handleAuditOrphanedAgents();
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Something went wrong"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Users className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Bulk Fix User Records</h1>
          </div>
          <p className="text-gray-600">
            This tool identifies and fixes orphaned agent records that have no corresponding User records.
          </p>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">⚠️ Production Impact Warning</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Orphaned agents cannot:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Access their dashboard (stuck on /subscribe)</li>
                  <li>Update their subscription status</li>
                  <li>Complete onboarding process</li>
                  <li>Manage their agent profile</li>
                </ul>
                <p className="mt-2 font-semibold">This affects real users who have paid for subscriptions!</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Step 1: Audit */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Step 1: Audit Orphaned Agents</h2>
            <p className="text-gray-600 mb-4">
              Find all agent records that don&apos;t have corresponding User records.
            </p>
            <button
              onClick={handleAuditOrphanedAgents}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Scanning..." : "Scan for Orphaned Agents"}
            </button>
          </div>

          {/* Audit Results */}
          {auditResults && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Audit Results ({auditResults.orphanedAgents.length} orphaned agents)
              </h2>
              
              {auditResults.orphanedAgents.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">All Good! 🎉</h3>
                  <p className="text-gray-600">No orphaned agents found. Database relationships are healthy.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto mb-6">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent Slug</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Missing User ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {auditResults.orphanedAgents.map((agent) => (
                          <tr key={agent.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {agent.slug}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                              {agent.userId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                agent.isSubscribed 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {agent.isSubscribed ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                agent.isSubscribed 
                                  ? 'bg-brand-light text-brand-deep' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {agent.isSubscribed ? '🚨 Paid user locked out' : '⚠️ Cannot subscribe'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Step 2: Bulk Fix */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Create Missing User Records</h3>
                    <p className="text-gray-600 mb-4">
                      This will create User records for each orphaned agent using their userId. 
                      This fixes the foreign key constraint and allows agents to access their profiles.
                    </p>
                    <button
                      onClick={handleBulkCreateUsers}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand disabled:opacity-50"
                    >
                      {isLoading ? "Creating User Records..." : `Create ${auditResults.orphanedAgents.length} Missing User Records`}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Status Messages */}
          {message && (
            <div className={`p-4 rounded-md flex items-center gap-2 ${
              message.startsWith("Success") || message.startsWith("All Good")
                ? "bg-green-50 text-green-800 border border-green-200" 
                : message.startsWith("Found")
                ? "bg-blue-50 text-blue-800 border border-blue-200"
                : "bg-brand-light text-brand-deep border border-brand-soft"
            }`}>
              {message.startsWith("Success") || message.startsWith("All Good") ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <XCircle size={16} className="text-brand" />
              )}
              {message}
            </div>
          )}

          {/* Information Panel */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
            <h3 className="text-lg font-medium text-blue-800 mb-2">How This Fix Works</h3>
            <div className="text-sm text-blue-700 space-y-2">
              <p><strong>1. Identification:</strong> Finds agents with userId that don&apos;t exist in User table</p>
              <p><strong>2. User Creation:</strong> Creates minimal User records with the missing userIds</p>
              <p><strong>3. Relationship Restoration:</strong> Fixes foreign key constraints</p>
              <p><strong>4. Access Restoration:</strong> Allows agents to access dashboard and manage profiles</p>
            </div>
            <div className="mt-4 text-sm text-blue-700">
              <p><strong>Note:</strong> Created User records will have minimal data (just ID).
              Users may need to complete their profile information when they next sign in.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}