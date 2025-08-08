import { headers } from 'next/headers';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

type UserResponse = {
  user: {
    name: string | null;
    email: string | null;
    accounts: { provider: string }[];
    agentProfile: { slug: string } | null;
    sessions: unknown[];
    payments: unknown[];
  };
};

async function fetchUser(id: string): Promise<UserResponse> {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/users/${id}`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load user');
  return res.json();
}

export default async function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const { user } = await fetchUser(id);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{user.name || 'User'}</h1>
        <p className="text-sm text-zinc-600">{user.email}</p>
      </div>

      <section className="border border-zinc-200 rounded-lg p-4">
        <h2 className="font-medium mb-2">Authentication</h2>
        <div className="text-sm text-zinc-700">Providers: {user.accounts.map((a) => a.provider).join(', ') || 'credentials'}</div>
      </section>

      <section className="border border-zinc-200 rounded-lg p-4">
        <h2 className="font-medium mb-2">Agent</h2>
        <div className="text-sm text-zinc-700">{user.agentProfile ? `Linked to agent: ${user.agentProfile.slug}` : 'No agent linked'}</div>
      </section>

      <section className="border border-zinc-200 rounded-lg p-4">
        <h2 className="font-medium mb-2">Sessions</h2>
        <div className="text-sm text-zinc-700">{user.sessions.length} active session(s)</div>
      </section>

      <section className="border border-zinc-200 rounded-lg p-4">
        <h2 className="font-medium mb-2">Payments</h2>
        <div className="text-sm text-zinc-700">{user.payments.length} payment(s)</div>
      </section>
    </div>
  );
}


