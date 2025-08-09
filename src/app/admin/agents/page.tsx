import Link from 'next/link';
import { headers } from 'next/headers';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

type AgentItem = {
  id: string;
  slug: string;
  city: string | null;
  area: string | null;
  isSubscribed: boolean;
  createdAt: string;
  user: { email: string | null; id: string } | null;
  _count: { properties: number; leads: number };
};

async function fetchAgents(): Promise<{ items: AgentItem[] }> {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/agents?page=1&pageSize=20`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load agents');
  return res.json();
}

export default async function AdminAgentsPage() {
  await requireAdmin();
  const { items } = await fetchAgents();
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Agents</h1>
      <div className="overflow-x-auto border border-zinc-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-3 py-2 text-left">Agent</th>
              <th className="px-3 py-2 text-left">City/Area</th>
              <th className="px-3 py-2 text-left">Subscribed</th>
              <th className="px-3 py-2 text-left">Properties</th>
              <th className="px-3 py-2 text-left">Leads</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="px-3 py-2">
                  <Link href={`/admin/agents/${a.slug}`} className="text-zinc-900 hover:underline">
                    {a.slug}
                  </Link>
                </td>
                <td className="px-3 py-2">{[a.city, a.area].filter(Boolean).join(' / ') || '—'}</td>
                <td className="px-3 py-2">{a.isSubscribed ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2">{a._count.properties}</td>
                <td className="px-3 py-2">{a._count.leads}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


