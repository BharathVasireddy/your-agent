import prisma from '@/lib/prisma';

export default async function ProductionAuditPage() {
  // Get all agents and their user relationship status
  const allAgents = await prisma.agent.findMany({
    select: {
      id: true,
      slug: true,
      userId: true,
      isSubscribed: true,
      subscriptionEndsAt: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          emailVerified: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  // Get all users and their agent relationship status
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      emailVerified: true,
      agentProfile: {
        select: {
          id: true,
          slug: true,
          isSubscribed: true,
        }
      },
      accounts: {
        select: {
          provider: true,
          type: true,
        }
      }
    },
    orderBy: {
      id: 'asc'
    }
  });

  // Get all sessions
  const allSessions = await prisma.session.findMany({
    select: {
      id: true,
      userId: true,
      expires: true,
      user: {
        select: {
          id: true,
          email: true,
        }
      }
    },
    orderBy: {
      expires: 'desc'
    }
  });

  // Calculate statistics
  const stats = {
    totalAgents: allAgents.length,
    orphanedAgents: allAgents.filter(agent => !agent.user).length,
    subscribedAgents: allAgents.filter(agent => agent.isSubscribed).length,
    orphanedSubscribedAgents: allAgents.filter(agent => agent.isSubscribed && !agent.user).length,
    totalUsers: allUsers.length,
    usersWithAgents: allUsers.filter(user => user.agentProfile).length,
    usersWithoutAgents: allUsers.filter(user => !user.agentProfile).length,
    totalSessions: allSessions.length,
    orphanedSessions: allSessions.filter(session => !session.user).length,
    activeSessions: allSessions.filter(session => new Date(session.expires) > new Date()).length,
  };

  const orphanedAgents = allAgents.filter(agent => !agent.user);
  const orphanedSessions = allSessions.filter(session => !session.user);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Production Database Audit</h1>
          <p className="text-gray-600 mt-2">Comprehensive analysis of User/Agent/Session relationships</p>
        </div>

        {/* Critical Issues Alert */}
        {(stats.orphanedAgents > 0 || stats.orphanedSessions > 0) && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6 mb-8">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800">🚨 CRITICAL PRODUCTION ISSUES DETECTED</h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc list-inside space-y-1">
                    {stats.orphanedAgents > 0 && (
                      <li><strong>{stats.orphanedAgents}</strong> agents have no corresponding User records (foreign key violation)</li>
                    )}
                    {stats.orphanedSubscribedAgents > 0 && (
                      <li><strong>{stats.orphanedSubscribedAgents}</strong> subscribed agents cannot access their dashboard</li>
                    )}
                    {stats.orphanedSessions > 0 && (
                      <li><strong>{stats.orphanedSessions}</strong> sessions point to non-existent users</li>
                    )}
                  </ul>
                  <p className="mt-3 font-semibold">These users will experience authentication and access issues!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Agents</h3>
            <div className="mt-2 space-y-2">
              <p className="text-3xl font-bold text-blue-600">{stats.totalAgents}</p>
              <p className="text-sm text-gray-500">Total agents</p>
              <p className="text-sm">
                <span className="text-green-600">{stats.subscribedAgents} subscribed</span>
              </p>
              {stats.orphanedAgents > 0 && (
                <p className="text-sm">
                  <span className="text-red-600">{stats.orphanedAgents} orphaned</span>
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Users</h3>
            <div className="mt-2 space-y-2">
              <p className="text-3xl font-bold text-green-600">{stats.totalUsers}</p>
              <p className="text-sm text-gray-500">Total users</p>
              <p className="text-sm">
                <span className="text-blue-600">{stats.usersWithAgents} with agents</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600">{stats.usersWithoutAgents} without agents</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Sessions</h3>
            <div className="mt-2 space-y-2">
              <p className="text-3xl font-bold text-purple-600">{stats.totalSessions}</p>
              <p className="text-sm text-gray-500">Total sessions</p>
              <p className="text-sm">
                <span className="text-green-600">{stats.activeSessions} active</span>
              </p>
              {stats.orphanedSessions > 0 && (
                <p className="text-sm">
                  <span className="text-red-600">{stats.orphanedSessions} orphaned</span>
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">Health Score</h3>
            <div className="mt-2 space-y-2">
              <p className={`text-3xl font-bold ${
                stats.orphanedAgents === 0 && stats.orphanedSessions === 0 
                  ? 'text-green-600' 
                  : stats.orphanedAgents < 5 
                    ? 'text-yellow-600' 
                    : 'text-red-600'
              }`}>
                {stats.orphanedAgents === 0 && stats.orphanedSessions === 0 ? '✅' : '⚠️'}
              </p>
              <p className="text-sm text-gray-500">Database integrity</p>
              <p className="text-xs">
                {stats.orphanedAgents === 0 && stats.orphanedSessions === 0 
                  ? 'All relationships healthy' 
                  : `${stats.orphanedAgents + stats.orphanedSessions} broken relationships`}
              </p>
            </div>
          </div>
        </div>

        {/* Orphaned Agents Details */}
        {orphanedAgents.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                🚨 Orphaned Agents ({orphanedAgents.length})
              </h2>
              <p className="text-sm text-gray-600">These agents cannot be accessed by their owners</p>
            </div>
            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orphanedAgents.map((agent) => (
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(agent.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            agent.isSubscribed 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {agent.isSubscribed ? 'Cannot access dashboard' : 'Cannot subscribe'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* All Users Summary */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Users ({stats.totalUsers})</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{user.name || 'No name'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400 font-mono">{user.id}</p>
                    </div>
                    <div className="text-right">
                      {user.agentProfile ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Has Agent
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          No Agent
                        </span>
                      )}
                    </div>
                  </div>
                  {user.agentProfile && (
                    <div className="text-sm text-gray-600">
                      <p>Agent: <span className="font-medium">{user.agentProfile.slug}</span></p>
                      <p>Subscribed: <span className={user.agentProfile.isSubscribed ? 'text-green-600' : 'text-gray-600'}>
                        {user.agentProfile.isSubscribed ? 'Yes' : 'No'}
                      </span></p>
                    </div>
                  )}
                  <div className="mt-2 text-xs text-gray-500">
                    Auth: {user.accounts?.map(acc => acc.provider).join(', ') || 'None'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fix Actions */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-4">🔧 Recommended Actions</h3>
          <div className="space-y-2 text-sm text-blue-700">
            {stats.orphanedAgents > 0 && (
              <>
                <p><strong>1. Immediate:</strong> Use <code>/debug/bulk-fix-users</code> to create missing User records</p>
                <p><strong>2. Communication:</strong> Contact affected users to re-authenticate if needed</p>
                <p><strong>3. Prevention:</strong> Review NextAuth configuration to ensure User records are created properly</p>
              </>
            )}
            {stats.orphanedAgents === 0 && (
              <p><strong>✅ All good!</strong> No immediate action needed. Database relationships are healthy.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}