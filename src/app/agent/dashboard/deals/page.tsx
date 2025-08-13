import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

async function fetchDeals() {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/deals?page=1&pageSize=24`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load deals');
  return res.json();
}

export default async function DealsPage() {
  const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
  if (!(session as unknown as { user?: unknown } | null)?.user) {
    return null;
  }

  const { items } = await fetchDeals();

  async function adopt(dealId: string) {
    'use server';
    const h = await headers();
    const host = h.get('host')!;
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    await fetch(`${protocol}://${host}/api/deals/${dealId}/adopt`, {
      method: 'POST',
      headers: { cookie: h.get('cookie') ?? '' },
      cache: 'no-store',
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Property Deals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((deal: { id: string; title: string; location: string; price: number; agentEarningAmount: number; photos?: string[] }) => (
          <div key={deal.id} className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
            {deal.photos?.[0] && (
              <div className="aspect-[16/9] relative">
                <Image src={deal.photos[0]} alt={deal.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-4 space-y-2">
              <div className="text-base font-medium text-zinc-900 line-clamp-1">{deal.title}</div>
              <div className="text-sm text-zinc-600 line-clamp-2">{deal.location}</div>
              <div className="text-sm text-zinc-700">₹{Intl.NumberFormat('en-IN').format(deal.price)}</div>
              <div className="text-xs text-emerald-700 bg-emerald-50 inline-flex rounded px-2 py-1">Earn ₹{Intl.NumberFormat('en-IN').format(deal.agentEarningAmount)}</div>
              <div className="pt-2 flex items-center gap-2">
                <form action={async () => adopt(deal.id)}>
                  <Button type="submit" variant="default">Add to my properties</Button>
                </form>
                <Link href={`/agent/dashboard/deals/${deal.id}`} className="text-zinc-700 hover:text-zinc-900">Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


