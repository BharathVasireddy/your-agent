import { requireAdmin } from '@/lib/admin';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type AdminDeal = {
  id: string;
  title: string;
  status: string;
  location: string;
  description: string;
  price: number;
  agentEarningAmount: number;
  amenities?: string[];
  photos?: string[];
  brochureUrl?: string | null;
};

async function fetchDeal(id: string) {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/deals?page=1&pageSize=1&status=&q=`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load deal');
  const all = (await res.json()) as { items: AdminDeal[] };
  const found = all.items.find((x) => x.id === id);
  return found;
}

async function updateDealAction(id: string, formData: FormData) {
  'use server';
  const admin = await requireAdmin();
  if (!admin) return;
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const payload = {
    id,
    title: String(formData.get('title') || ''),
    description: String(formData.get('description') || ''),
    price: Number(formData.get('price') || 0),
    agentEarningAmount: Number(formData.get('agentEarningAmount') || 0),
    status: String(formData.get('status') || 'Active'),
    location: String(formData.get('location') || ''),
    amenities: String(formData.get('amenities') || '').split(',').map(s => s.trim()).filter(Boolean),
    photos: String(formData.get('photos') || '').split(',').map(s => s.trim()).filter(Boolean),
    brochureUrl: String(formData.get('brochureUrl') || '') || null,
  };
  const res = await fetch(`${protocol}://${host}/api/admin/deals`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', cookie: h.get('cookie') ?? '' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update deal');
  redirect('/admin/deals');
}

export default async function AdminDealDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const deal = await fetchDeal(id);
  if (!deal) redirect('/admin/deals');

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Edit Deal</h1>
      <form action={updateDealAction.bind(null, id)} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 border border-zinc-200 rounded-lg">
        <label className="space-y-1">
          <span className="text-sm text-zinc-700">Title</span>
          <Input name="title" defaultValue={deal.title} required />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-zinc-700">Status</span>
          <Input name="status" defaultValue={deal.status} />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Description</span>
          <Textarea name="description" rows={4} defaultValue={deal.description} required />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-zinc-700">Price (₹)</span>
          <Input name="price" type="number" min={0} defaultValue={deal.price} required />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-zinc-700">Agent Earning Amount (₹)</span>
          <Input name="agentEarningAmount" type="number" min={0} defaultValue={deal.agentEarningAmount} required />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Location</span>
          <Input name="location" defaultValue={deal.location} />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Amenities (comma-separated)</span>
          <Input name="amenities" defaultValue={(deal.amenities || []).join(', ')} />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Photos (comma-separated URLs)</span>
          <Input name="photos" defaultValue={(deal.photos || []).join(', ')} />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Brochure URL</span>
          <Input name="brochureUrl" defaultValue={deal.brochureUrl || ''} />
        </label>
        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
          <Button type="submit" variant="default">Save</Button>
        </div>
      </form>
      <div className="text-sm text-zinc-600">
        Tip: Set status to &quot;Sold&quot; to remove it from agent profiles immediately and mark adopted listings as Sold.
      </div>
    </div>
  );
}


