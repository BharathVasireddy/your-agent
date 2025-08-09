import { headers } from 'next/headers';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

type OrphanedResponse = {
  stats: { totalAgents: number; orphanedAgents: number; subscribedOrphaned: number; healthyAgents: number };
  orphanedAgents: { id: string; slug: string; userId: string; isSubscribed: boolean; subscriptionEndsAt: string | null; createdAt: string }[];
};

async function fetchAudit(): Promise<OrphanedResponse> {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/system/orphaned`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load system audit');
  return res.json();
}

export default async function AdminSystemPage() {
  await requireAdmin();
  const data = await fetchAudit();
  return (
    <div className="space-y-6">
      <section className="border border-zinc-200 rounded-lg p-4">
        <h2 className="font-medium mb-2">Agent Data Health</h2>
        <div className="text-sm text-zinc-700 grid grid-cols-2 gap-2 max-w-md">
          <div>Total Agents: {data.stats.totalAgents}</div>
          <div>Healthy Agents: {data.stats.healthyAgents}</div>
          <div>Orphaned Agents: {data.stats.orphanedAgents}</div>
          <div>Subscribed Orphaned: {data.stats.subscribedOrphaned}</div>
        </div>
      </section>

      <section className="border border-zinc-200 rounded-lg p-4">
        <h2 className="font-medium mb-2">Orphaned Agents</h2>
        {data.orphanedAgents.length === 0 ? (
          <div className="text-sm text-zinc-600">No orphaned agents found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-50 text-zinc-600">
                <tr>
                  <th className="px-3 py-2 text-left">Slug</th>
                  <th className="px-3 py-2 text-left">User ID</th>
                  <th className="px-3 py-2 text-left">Subscribed</th>
                  <th className="px-3 py-2 text-left">Created</th>
                </tr>
              </thead>
              <tbody>
                {data.orphanedAgents.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-3 py-2">{a.slug}</td>
                    <td className="px-3 py-2">{a.userId}</td>
                    <td className="px-3 py-2">{a.isSubscribed ? 'Yes' : 'No'}</td>
                    <td className="px-3 py-2">{new Date(a.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}


