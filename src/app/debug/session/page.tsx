import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getUserFlowStatus } from '@/lib/userFlow';
import prisma from '@/lib/prisma';

interface ExtendedSession {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
}

export default async function DebugSessionPage() {
  // Get session
  const session = await getServerSession(authOptions);
  
  // Get user flow status
  const flowStatus = await getUserFlowStatus();
  
  // If authenticated, get user and agent data
  let userData = null;
  let agentData = null;
  let allAgents = null;
  
  if (session?.user) {
    const userId = (session as unknown as ExtendedSession).user.id;
    
    // Get user data
    userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        agentProfile: {
          select: {
            id: true,
            slug: true,
            isSubscribed: true,
            subscriptionEndsAt: true,
            experience: true,
            bio: true,
            phone: true,
            city: true,
            area: true,
          }
        }
      }
    });
    
    // Get agent data by userId
    agentData = await prisma.agent.findUnique({
      where: { userId },
      select: {
        id: true,
        slug: true,
        isSubscribed: true,
        subscriptionEndsAt: true,
        experience: true,
        bio: true,
        phone: true,
        city: true,
        area: true,
        userId: true,
      }
    });
    
    // Get all agents to see if there's a mismatch
    allAgents = await prisma.agent.findMany({
      select: {
        id: true,
        slug: true,
        isSubscribed: true,
        userId: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          }
        }
      }
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Session & Database</h1>
        
        <div className="space-y-6">
          {/* Session Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Session Information</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>

          {/* Flow Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Flow Status</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(flowStatus, null, 2)}
            </pre>
          </div>

          {/* User Data */}
          {userData && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User Data (with agentProfile relation)</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          )}

          {/* Agent Data */}
          {agentData && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Data (direct lookup by userId)</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(agentData, null, 2)}
              </pre>
            </div>
          )}

          {/* All Agents */}
          {allAgents && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">All Agents in Database</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(allAgents, null, 2)}
              </pre>
            </div>
          )}

          {/* Environment Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Environment Information</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
{`NODE_ENV: ${process.env.NODE_ENV}
BYPASS_SUBSCRIPTION: ${process.env.BYPASS_SUBSCRIPTION}
DATABASE_URL exists: ${!!process.env.DATABASE_URL}
DATABASE_URL prefix: ${process.env.DATABASE_URL?.substring(0, 20)}...`}
            </pre>
          </div>

          {/* User ID Comparison */}
          {session?.user && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">User ID Analysis</h2>
              <div className="space-y-2 text-sm">
                <p><strong>Session User ID:</strong> {(session as unknown as ExtendedSession).user.id}</p>
                <p><strong>Agent Found:</strong> {agentData ? 'Yes' : 'No'}</p>
                <p><strong>Agent User ID:</strong> {agentData?.userId}</p>
                <p><strong>IDs Match:</strong> {(session as unknown as ExtendedSession).user.id === agentData?.userId ? 'Yes' : 'No'}</p>
                <p><strong>Agent is Subscribed:</strong> {agentData?.isSubscribed ? 'Yes' : 'No'}</p>
                <p><strong>Subscription Ends:</strong> {agentData?.subscriptionEndsAt ? new Date(agentData.subscriptionEndsAt).toISOString() : 'N/A'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}