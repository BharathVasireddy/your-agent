// import { headers } from 'next/headers';
import { requireAdmin } from '@/lib/admin';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import bcrypt from 'bcryptjs';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

function parseUserSlug(slug: string): string | null {
  // Convert email-based slug back to email
  if (slug.includes('-')) {
    // Handle format like "user-example-com" -> "user@example.com"
    const parts = slug.split('-');
    if (parts.length >= 3) {
      const domain = parts.slice(-2).join('.');
      const localPart = parts.slice(0, -2).join('-');
      return `${localPart}@${domain}`;
    }
  }
  return null;
}

async function fetchUserBySlug(userSlug: string) {
  // First try to parse as email slug
  const email = parseUserSlug(userSlug);
  
  let user;
  if (email) {
    user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
        sessions: true,
        agentProfile: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
  }
  
  // Fallback to ID if email lookup fails
  if (!user) {
    user = await prisma.user.findUnique({
      where: { id: userSlug },
      include: {
        accounts: true,
        sessions: true,
        agentProfile: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });
  }
  
  return user;
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ userSlug: string }> }) {
  await requireAdmin();
  const { userSlug } = await params;
  const user = await fetchUserBySlug(userSlug);
  
  if (!user) {
    notFound();
  }
  
  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center text-sm font-medium">
            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-zinc-900">{user.name || 'Unnamed User'}</h1>
            <p className="text-sm text-zinc-600">{user.email}</p>
      <div className="flex items-center gap-2 mt-1">
              <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                user.isActive ? 'bg-green-100 text-green-700' : 'bg-brand-light text-brand-hover'
              }`}>
                {user.isActive ? 'Active' : 'Suspended'}
              </span>
              {user.agentProfile && (
                <a href={`/${user.agentProfile.slug}`} target="_blank" className="text-xs text-brand hover:underline">
              Agent: {user.agentProfile.slug}
            </a>
              )}
            </div>
          </div>
        </div>
        <AdminQuickActions userId={user.id} isActive={user.isActive} userSlug={userSlug} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Column - User Info */}
        <div className="space-y-4">
          {/* Basic Info */}
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <h3 className="font-medium text-zinc-900 mb-3">Account Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">Auth Providers:</span>
                <span>{user.accounts.length > 0 ? user.accounts.map(a => a.provider).join(', ') : 'Email'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Has Password:</span>
                <span>{user.password ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Email Verified:</span>
                <span>{user.emailVerified ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Active Sessions:</span>
                <span>{user.sessions.length}</span>
              </div>
            </div>
          </div>

          {/* Agent Profile Summary */}
          {user.agentProfile && (
            <div className="bg-white border border-zinc-200 rounded-lg p-4">
              <h3 className="font-medium text-zinc-900 mb-3">Agent Profile</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Subscription:</span>
                  <span className={user.agentProfile.isSubscribed ? 'text-green-600' : 'text-brand'}>
                    {user.agentProfile.isSubscribed ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Location:</span>
                  <span>{[user.agentProfile.city, user.agentProfile.area].filter(Boolean).join(', ') || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Experience:</span>
                  <span>{user.agentProfile.experience ? `${user.agentProfile.experience} years` : '—'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center Column - Activity */}
        <div className="space-y-4">
          {/* Recent Payments */}
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <h3 className="font-medium text-zinc-900 mb-3">Recent Payments ({user.payments.length})</h3>
            {user.payments.length > 0 ? (
              <div className="space-y-2">
             {user.payments.slice(0, 5).map((payment: { id: string; amount: number; currency: string; createdAt: string | Date; status: string }) => (
                  <div key={payment.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                    <div>
                      <div className="text-sm font-medium">
                        {new Intl.NumberFormat('en-IN', { 
                          style: 'currency', 
                          currency: payment.currency 
                        }).format(payment.amount / 100)}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      payment.status === 'completed' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No payments yet</p>
            )}
          </div>

          {/* Active Sessions */}
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <h3 className="font-medium text-zinc-900 mb-3">Active Sessions ({user.sessions.length})</h3>
            {user.sessions.length > 0 ? (
              <div className="space-y-2">
                {user.sessions.map((session: { id: string; expires: string | Date }) => (
                  <div key={session.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
                    <div>
                      <div className="text-sm font-medium">Session {session.id.slice(-8)}</div>
                      <div className="text-xs text-zinc-500">
                        Expires {new Date(session.expires).toLocaleDateString()}
                      </div>
                    </div>
                    <RevokeSessionButton sessionId={session.id} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">No active sessions</p>
            )}
          </div>
        </div>

        {/* Right Column - Agent Activity (if agent exists) */}
        {user.agentProfile && (
          <AgentActivitySummary agentId={user.agentProfile.id} agentSlug={user.agentProfile.slug} />
        )}
      </div>
    </div>
  );
}

function AdminQuickActions({ userId, isActive, userSlug }: { 
  userId: string; 
  isActive: boolean; 
  userSlug: string;
}) {
  async function resetPassword(formData: FormData) {
    'use server';
    const admin = await requireAdmin();
    if (!admin) return;
    const password = String(formData.get('password'));
    if (password.length < 6) return;
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashedPassword } });
    revalidatePath(`/admin/users/${userSlug}`);
  }

  async function toggleUserStatus() {
    'use server';
    const admin = await requireAdmin();
    if (!admin) return;
    await prisma.user.update({ 
      where: { id: userId }, 
      data: { 
        isActive: !isActive,
        suspendedAt: !isActive ? null : new Date(),
        suspendedBy: !isActive ? null : admin.id
      } 
    });
    revalidatePath(`/admin/users/${userSlug}`);
    revalidatePath('/admin/users');
  }

  return (
    <div className="flex items-center gap-2">
      <form action={resetPassword} className="flex gap-1">
        <Input name="password" type="password" placeholder="New password" className="w-32 h-8 text-xs" />
        <Button type="submit" variant="secondary" size="sm">Reset</Button>
      </form>
      <form action={toggleUserStatus}>
        <Button 
          type="submit" 
          variant={isActive ? "destructive" : "secondary"}
          size="sm"
        >
          {isActive ? 'Suspend' : 'Activate'}
        </Button>
      </form>
    </div>
  );
}

function RevokeSessionButton({ sessionId }: { sessionId: string }) {
  async function revokeSession(formData: FormData) {
    'use server';
    const admin = await requireAdmin();
    if (!admin) return;
    const id = String(formData.get('sessionId'));
    await prisma.session.delete({ where: { id } });
    revalidatePath(`/admin/users/[userSlug]`, 'page');
  }

  return (
    <form action={revokeSession}>
      <input type="hidden" name="sessionId" value={sessionId} />
      <Button type="submit" variant="outline" size="sm">Revoke</Button>
    </form>
  );
}

async function AgentActivitySummary({ agentId, agentSlug }: { agentId: string; agentSlug: string }) {
  // Fetch agent activity data
  const [properties, leads, pageViews] = await Promise.all([
    prisma.property.findMany({
      where: { agentId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, title: true, status: true, createdAt: true, slug: true }
    }),
    prisma.lead.findMany({
      where: { agentId },
      orderBy: { timestamp: 'desc' },
      take: 10,
      select: { id: true, type: true, source: true, timestamp: true }
    }),
    prisma.pageView.count({ where: { agentId } })
  ]);

  return (
    <div className="space-y-4">
      {/* Properties */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4">
        <h3 className="font-medium text-zinc-900 mb-3">Recent Properties ({properties.length})</h3>
        {properties.length > 0 ? (
          <div className="space-y-2">
            {properties.map((prop) => (
              <div key={prop.id} className="py-2 border-b border-zinc-100 last:border-0">
                <div className="text-sm font-medium">{prop.title}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    {new Date(prop.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    prop.status === 'Available' 
                      ? 'bg-green-100 text-green-700'
                      : prop.status === 'Sold'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {prop.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No properties yet</p>
        )}
      </div>

      {/* Leads */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4">
        <h3 className="font-medium text-zinc-900 mb-3">Recent Leads ({leads.length})</h3>
        {leads.length > 0 ? (
          <div className="space-y-2">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="py-2 border-b border-zinc-100 last:border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium capitalize">{lead.type}</div>
                    <div className="text-xs text-zinc-500">
                      {lead.source} • {new Date(lead.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-500">No leads yet</p>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4">
        <h3 className="font-medium text-zinc-900 mb-3">Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">Total Page Views:</span>
            <span>{pageViews}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Total Properties:</span>
            <span>{properties.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Total Leads:</span>
            <span>{leads.length}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-zinc-200">
          <a 
            href={`/admin/agents/${agentSlug}`} 
            className="text-sm text-brand hover:underline"
          >
            View Full Agent Details →
          </a>
        </div>
      </div>
    </div>
  );
}
