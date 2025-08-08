import Link from 'next/link';
import { headers } from 'next/headers';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

type UserListItem = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  authProviders: string[];
  hasAgent: boolean;
  agentSlug: string | null;
};

async function fetchUsers(): Promise<{ items: UserListItem[]; total: number }> {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/users?page=1&pageSize=20`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

export default async function AdminUsersPage() {
  await requireAdmin();
  const { items } = await fetchUsers();
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Users</h1>
      <div className="overflow-x-auto border border-zinc-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Email</th>
              <th className="px-3 py-2 text-left">Auth</th>
              <th className="px-3 py-2 text-left">Agent</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="px-3 py-2">
                  <Link href={`/admin/users/${u.id}`} className="text-zinc-900 hover:underline">
                    {u.name || '—'}
                  </Link>
                </td>
                <td className="px-3 py-2">{u.email || '—'}</td>
                <td className="px-3 py-2">{u.authProviders.join(', ') || 'credentials'}</td>
                <td className="px-3 py-2">
                  {u.hasAgent && u.agentSlug ? (
                    <Link href={`/${u.agentSlug}`} className="text-blue-600 hover:underline">{u.agentSlug}</Link>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


