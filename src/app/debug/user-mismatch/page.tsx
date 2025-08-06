import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export default async function UserMismatchDebugPage() {
  // Get session
  const session = await getServerSession(authOptions);
  
  // Get all users and agents from database
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      agentProfile: {
        select: {
          id: true,
          slug: true,
          isSubscribed: true,
          userId: true,
        }
      }
    }
  });

  const allAgents = await prisma.agent.findMany({
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

  // Check if session user exists in database
  let sessionUserExists = false;
  let sessionUserRecord = null;
  
  if (session?.user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUserId = (session as any).user.id as string;
    
    sessionUserRecord = await prisma.user.findUnique({
      where: { id: sessionUserId },
      include: {
        agentProfile: true,
        accounts: true,
      }
    });
    
    sessionUserExists = !!sessionUserRecord;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User/Session Mismatch Debug</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Session</h2>
            {session?.user ? (
              <div className="space-y-2">
                <p><strong>Session User ID:</strong> {(session as any).user.id}</p>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Name:</strong> {session.user.name}</p>
                <p><strong>User Exists in DB:</strong> 
                  <span className={sessionUserExists ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {sessionUserExists ? ' ✅ YES' : ' ❌ NO'}
                  </span>
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No session found</p>
            )}
          </div>

          {/* Session User Record */}
          {sessionUserRecord && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Session User Database Record</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(sessionUserRecord, null, 2)}
              </pre>
            </div>
          )}

          {/* All Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Users in Database ({allUsers.length})</h2>
            <div className="space-y-2 max-h-96 overflow-auto">
              {allUsers.map((user) => (
                <div key={user.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Has Agent:</strong> {user.agentProfile ? '✅ Yes' : '❌ No'}</p>
                  {user.agentProfile && (
                    <p><strong>Agent Subscribed:</strong> {user.agentProfile.isSubscribed ? '✅ Yes' : '❌ No'}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* All Agents */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Agents in Database ({allAgents.length})</h2>
            <div className="space-y-2 max-h-96 overflow-auto">
              {allAgents.map((agent) => (
                <div key={agent.id} className="border-l-4 border-green-500 pl-4 py-2">
                  <p><strong>Agent ID:</strong> {agent.id}</p>
                  <p><strong>Slug:</strong> {agent.slug}</p>
                  <p><strong>User ID:</strong> {agent.userId}</p>
                  <p><strong>Subscribed:</strong> {agent.isSubscribed ? '✅ Yes' : '❌ No'}</p>
                  <p><strong>User Exists:</strong> {agent.user ? '✅ Yes' : '❌ No'}</p>
                  {agent.user && (
                    <>
                      <p><strong>User Email:</strong> {agent.user.email}</p>
                      <p><strong>User Name:</strong> {agent.user.name}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Orphaned Agents */}
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis</h2>
            <div className="space-y-4">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h3 className="font-semibold text-yellow-800">Foreign Key Constraint Issue</h3>
                <p className="text-yellow-700">
                  The error occurs because the session user ID doesn't exist in the User table. 
                  This prevents creating an Agent record due to the foreign key constraint.
                </p>
              </div>
              
              {session?.user && !sessionUserExists && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h3 className="font-semibold text-red-800">Critical Issue Found</h3>
                  <p className="text-red-700">
                    Your session user ID <code>{(session as any).user.id}</code> does not exist in the User table.
                    This is why you're being redirected to /subscribe and why the grantSubscription fails.
                  </p>
                </div>
              )}

              {allAgents.some(agent => !agent.user) && (
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                  <h3 className="font-semibold text-orange-800">Orphaned Agents Found</h3>
                  <p className="text-orange-700">
                    Some agents exist without corresponding users. This can happen when User records are deleted 
                    but Agent records remain.
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                <h3 className="font-semibold text-blue-800">Possible Solutions</h3>
                <ul className="list-disc list-inside text-blue-700 space-y-1">
                  <li>Re-authenticate to create a proper User record</li>
                  <li>Manually create a User record with your session ID</li>
                  <li>Check if you're using the correct database in production</li>
                  <li>Verify NextAuth is creating User records properly</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}