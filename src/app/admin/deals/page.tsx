import { requireAdmin } from '@/lib/admin';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-950">Deals</h1>
        <Link href="/admin/deals/new">
          <Button className="bg-brand hover:bg-brand-hover text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Deal
          </Button>
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900">Title</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-zinc-900">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                  <div className="flex flex-col items-center space-y-3">
                    <p className="text-lg font-medium">No deals found</p>
                    <p className="text-sm">Create your first deal to get started.</p>
                    <Link href="/admin/deals/new">
                      <Button className="bg-brand hover:bg-brand-hover text-white mt-2">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Deal
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              items.map((d) => (
                <tr key={d.id} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/admin/deals/${d.id}`} className="text-brand hover:text-brand-hover font-medium">
                      {d.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-zinc-600">{d.status}</td>
                  <td className="px-6 py-4 text-zinc-600">{d.propertyType}</td>
                  <td className="px-6 py-4 text-zinc-600">{d.location}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


