import { requireAdmin } from '@/lib/admin';
import { headers } from 'next/headers';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';

async function createDeal(formData: FormData) {
  'use server';
  const admin = await requireAdmin();
  if (!admin) return;

  const payload = {
    title: String(formData.get('title') || ''),
    description: String(formData.get('description') || ''),
    price: Number(formData.get('price') || 0),
    agentEarningAmount: Number(formData.get('agentEarningAmount') || 0),
    listingType: String(formData.get('listingType') || 'Sale'),
    propertyType: String(formData.get('propertyType') || 'Flat/Apartment'),
    location: String(formData.get('location') || ''),
    amenities: String(formData.get('amenities') || '').split(',').map(s => s.trim()).filter(Boolean),
    photos: String(formData.get('photos') || '').split(',').map(s => s.trim()).filter(Boolean),
    brochureUrl: String(formData.get('brochureUrl') || '') || null,
    propertyData: (() => { const raw = String(formData.get('propertyData') || ''); try { return raw ? JSON.parse(raw) : null; } catch { return null; } })(),
    minPageViewsLast30d: formData.get('minPageViewsLast30d') ? Number(formData.get('minPageViewsLast30d')) : null,
    minProfileViewsLast30d: formData.get('minProfileViewsLast30d') ? Number(formData.get('minProfileViewsLast30d')) : null,
    allowedCities: String(formData.get('allowedCities') || '').split(',').map(s => s.trim()).filter(Boolean),
    allowedAreas: String(formData.get('allowedAreas') || '').split(',').map(s => s.trim()).filter(Boolean),
    allowedAgentSlugs: String(formData.get('allowedAgentSlugs') || '').split(',').map(s => s.trim()).filter(Boolean),
    excludedCities: String(formData.get('excludedCities') || '').split(',').map(s => s.trim()).filter(Boolean),
    excludedAreas: String(formData.get('excludedAreas') || '').split(',').map(s => s.trim()).filter(Boolean),
    excludedAgentSlugs: String(formData.get('excludedAgentSlugs') || '').split(',').map(s => s.trim()).filter(Boolean),
  };

  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/deals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: h.get('cookie') ?? '' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error('Failed to create deal');
  }
  redirect('/admin/deals');
}

export default async function NewDealPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Create Deal</h1>
      <form action={createDeal} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 border border-zinc-200 rounded-lg">
        <label className="space-y-1">
          <span className="text-sm text-zinc-700">Title</span>
          <Input name="title" required />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Description</span>
          <Textarea name="description" rows={4} required />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-zinc-700">Price (₹)</span>
          <Input name="price" type="number" min={0} required />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-zinc-700">Agent Earning Amount (₹)</span>
          <Input name="agentEarningAmount" type="number" min={0} required />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-zinc-700">Listing Type</span>
          <Input name="listingType" defaultValue="Sale" />
        </label>
        <label className="space-y-1">
          <span className="text-sm text-zinc-700">Property Type</span>
          <Input name="propertyType" defaultValue="Flat/Apartment" />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Location</span>
          <Input name="location" />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Amenities (comma-separated)</span>
          <Input name="amenities" />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Photos (comma-separated URLs)</span>
          <Input name="photos" />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Brochure URL</span>
          <Input name="brochureUrl" />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Property Data (JSON matching selected type)</span>
          <Textarea name="propertyData" rows={6} />
        </label>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="space-y-1">
            <span className="text-sm text-zinc-700">Min Profile Views (30d)</span>
            <Input name="minProfileViewsLast30d" type="number" min={0} />
          </label>
          <label className="space-y-1">
            <span className="text-sm text-zinc-700">Min Page Views (30d)</span>
            <Input name="minPageViewsLast30d" type="number" min={0} />
          </label>
        </div>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Allowed Cities (comma-separated)</span>
          <Input name="allowedCities" />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Allowed Areas (comma-separated)</span>
          <Input name="allowedAreas" />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Allowed Agent Slugs (comma-separated)</span>
          <Input name="allowedAgentSlugs" />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Excluded Cities (comma-separated)</span>
          <Input name="excludedCities" />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Excluded Areas (comma-separated)</span>
          <Input name="excludedAreas" />
        </label>
        <label className="space-y-1 md:col-span-2">
          <span className="text-sm text-zinc-700">Excluded Agent Slugs (comma-separated)</span>
          <Input name="excludedAgentSlugs" />
        </label>
        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
          <Button type="submit" variant="default">Create Deal</Button>
        </div>
      </form>
    </div>
  );
}


