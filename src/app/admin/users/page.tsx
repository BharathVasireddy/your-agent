import Link from 'next/link';
import { headers } from 'next/headers';
import { requireAdmin } from '@/lib/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// Unused here (used in server actions on other pages)
// import prisma from '@/lib/prisma';
// import { revalidatePath } from 'next/cache';
// import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

type UserListItem = {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  isActive: boolean;
  suspendedAt: string | null;
  createdAt: string;
  authProviders: string[];
  hasAgent: boolean;
  agentSlug: string | null;
  sessionsCount: number;
  paymentsCount: number;
};

function createUserSlug(email: string): string {
  return email.toLowerCase().replace(/[@.]/g, '-');
}

async function fetchUsers(searchParams: URLSearchParams): Promise<{ items: UserListItem[]; total: number }> {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const queryString = searchParams.toString();
  const res = await fetch(`${protocol}://${host}/api/admin/users?${queryString}`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
  await requireAdmin();
  const params = await searchParams;
  const urlParams = new URLSearchParams();
  
  const search = params.search || '';
  const status = params.status || '';
  const page = params.page || '1';
  
  if (search) urlParams.set('q', search);
  if (status) urlParams.set('status', status);
  urlParams.set('page', page);
  urlParams.set('pageSize', '50');

  const { items, total } = await fetchUsers(urlParams);
  
  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-zinc-900">Users ({total})</h1>
        <form method="GET" className="flex gap-2">
          <Input
            name="search"
            placeholder="Search users..."
            defaultValue={search}
            className="w-64"
          />
          <select 
            name="status" 
            defaultValue={status}
            className="border border-zinc-200 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <Button type="submit" size="sm">Filter</Button>
          {(search || status) && (
            <Link href="/admin/users">
              <Button variant="outline" size="sm">Clear</Button>
            </Link>
          )}
        </form>
      </div>

      {/* Compact Table */}
      <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-zinc-600">User</th>
              <th className="px-3 py-2 text-left font-medium text-zinc-600">Status</th>
              <th className="px-3 py-2 text-left font-medium text-zinc-600">Agent</th>
              <th className="px-3 py-2 text-left font-medium text-zinc-600">Sessions</th>
              <th className="px-3 py-2 text-left font-medium text-zinc-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {items.map((user) => (
              <CompactUserRow key={user.id} user={user} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple Pagination */}
      {total > 50 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-zinc-600">
            {((parseInt(page) - 1) * 50) + 1}-{Math.min(parseInt(page) * 50, total)} of {total}
          </span>
          <div className="flex gap-1">
            {parseInt(page) > 1 && (
              <Link href={`?${new URLSearchParams({...params, page: String(parseInt(page) - 1)}).toString()}`}>
                <Button variant="outline" size="sm">Previous</Button>
              </Link>
            )}
            {total > parseInt(page) * 50 && (
              <Link href={`?${new URLSearchParams({...params, page: String(parseInt(page) + 1)}).toString()}`}>
                <Button variant="outline" size="sm">Next</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CompactUserRow({ user }: { user: UserListItem }) {
  const userSlug = user.email ? createUserSlug(user.email) : user.id;
  
  return (
    <tr className="hover:bg-zinc-50">
      <td className="px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-medium">
            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <Link href={`/admin/users/${userSlug}`} className="font-medium text-zinc-900 hover:underline">
              {user.name || 'Unnamed User'}
            </Link>
            <div className="text-xs text-zinc-500">{user.email}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-2">
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
          user.isActive 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {user.isActive ? 'Active' : 'Suspended'}
        </span>
      </td>
      <td className="px-3 py-2">
        {user.hasAgent && user.agentSlug ? (
          <Link href={`/${user.agentSlug}`} className="text-red-600 hover:underline text-sm">
            {user.agentSlug}
          </Link>
        ) : (
          <span className="text-zinc-400 text-sm">—</span>
        )}
      </td>
      <td className="px-3 py-2 text-sm text-zinc-600">
        {user.sessionsCount}
      </td>
      <td className="px-3 py-2">
        <Link href={`/admin/users/${userSlug}`}>
          <Button variant="outline" size="sm">View</Button>
        </Link>
      </td>
    </tr>
  );
}




