import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { headers } from 'next/headers';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

type DealItem = {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  agentEarningAmount: number;
  photos?: string[];
};

async function fetchDeal(id: string) {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/deals?page=1&pageSize=200`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load deal');
  const all = (await res.json()) as { items: DealItem[] };
  const found = all.items.find((x) => x.id === id);
  return found;
}

async function adoptAction(id: string) {
  'use server';
  const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
  if (!(session as unknown as { user?: unknown } | null)?.user) redirect('/login');
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/deals/${id}/adopt`, {
    method: 'POST',
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) redirect('/agent/dashboard/deals?error=adopt-failed');
  redirect('/agent/dashboard/properties?notice=deal-adopted');
}

export default async function AgentDealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions as unknown as { [k: string]: unknown });
  if (!(session as unknown as { user?: unknown } | null)?.user) redirect('/login');
  const { id } = await params;
  const deal = await fetchDeal(id);
  if (!deal) redirect('/agent/dashboard/deals');
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {deal.photos?.[0] && (
            <div className="aspect-[16/9] relative rounded-lg overflow-hidden border border-zinc-200">
              <Image src={deal.photos[0]} alt={deal.title} fill className="object-cover" />
            </div>
          )}
          <h1 className="text-2xl font-semibold mt-4">{deal.title}</h1>
          <div className="text-zinc-600">{deal.location}</div>
          <p className="mt-3 text-zinc-800">{deal.description}</p>
        </div>
        <div className="bg-white border border-zinc-200 rounded-lg p-4 space-y-3 h-max">
          <div className="text-sm text-zinc-600">Price</div>
          <div className="text-2xl font-semibold">₹{Intl.NumberFormat('en-IN').format(deal.price)}</div>
          <div className="text-sm text-zinc-600">You can earn</div>
          <div className="text-lg font-medium text-emerald-700 bg-emerald-50 rounded px-2 py-1 inline-block">₹{Intl.NumberFormat('en-IN').format(deal.agentEarningAmount)}</div>
          <form action={adoptAction.bind(null, id)} className="pt-2">
            <Button type="submit" variant="default" className="w-full">Add to my properties</Button>
          </form>
        </div>
      </div>
    </div>
  );
}


