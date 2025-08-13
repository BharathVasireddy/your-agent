import { requireAdmin } from '@/lib/admin';
import { headers } from 'next/headers';
import Link from 'next/link';

type AdminDealListItem = {
  id: string;
  title: string;
  status: string;
  propertyType?: string;
  location?: string;
};

async function fetchDeals() {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/deals?page=1&pageSize=50`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load deals');
  return res.json() as Promise<{ items: AdminDealListItem[] }>;
}

export default async function AdminDealsPage() {
  await requireAdmin();
  const { items } = await fetchDeals();
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Deals</h1>
      <div className="overflow-x-auto border border-zinc-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.id} className="border-t">
                <td className="px-3 py-2">
                  <Link href={`/admin/deals/${d.id}`} className="text-blue-600 hover:underline">{d.title}</Link>
                </td>
                <td className="px-3 py-2">{d.status}</td>
                <td className="px-3 py-2">{d.propertyType}</td>
                <td className="px-3 py-2">{d.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


