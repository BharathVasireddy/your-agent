import { requireAdmin } from '@/lib/admin';
import { headers } from 'next/headers';
// Unused imports removed
import { redirect } from 'next/navigation';
// Unused imports removed
import { z } from 'zod';
import NewDealWizard from './NewDealWizard';
import type { DealActionState } from './NewDealClient';

const dealSchema = z
  .object({
    title: z.string().min(3, 'Title is required'),
    description: z.string().min(10, 'Description is required'),
    price: z.coerce.number().int().nonnegative('Price must be >= 0'),
    agentEarningAmount: z.coerce.number().int().nonnegative('Agent earning must be >= 0'),
    listingType: z.enum(['Sale', 'Rent']),
    propertyType: z.string().min(3),
    location: z.string().min(2),
    amenities: z.array(z.string()).default([]),
    photos: z.array(z.string().url('Photo must be a URL')).default([]),
    brochureUrl: z.string().url().nullable().optional(),
    propertyData: z.any().optional(),
    minPageViewsLast30d: z.coerce.number().int().nonnegative().nullable().optional(),
    minProfileViewsLast30d: z.coerce.number().int().nonnegative().nullable().optional(),
    allowedCities: z.array(z.string()).default([]),
    allowedAreas: z.array(z.string()).default([]),
    allowedAgentSlugs: z.array(z.string()).default([]),
    excludedCities: z.array(z.string()).default([]),
    excludedAreas: z.array(z.string()).default([]),
    excludedAgentSlugs: z.array(z.string()).default([]),
  })
  .refine((d) => d.agentEarningAmount <= d.price, {
    message: 'Agent earning cannot exceed price',
    path: ['agentEarningAmount'],
  });

async function createDeal(_: DealActionState, formData: FormData): Promise<DealActionState> {
  'use server';
  const admin = await requireAdmin();
  if (!admin) return { error: 'Unauthorized' };

  const payload = {
    title: String(formData.get('title') || ''),
    description: String(formData.get('description') || ''),
    price: Number(formData.get('price') || 0),
    agentEarningAmount: Number(formData.get('agentEarningAmount') || 0),
    listingType: String(formData.get('listingType') || 'Sale'),
    propertyType: String(formData.get('propertyType') || 'Flat/Apartment'),
    location: String(formData.get('location') || ''),
    amenities: String(formData.get('amenities') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    photos: String(formData.get('photos') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    brochureUrl: String(formData.get('brochureUrl') || '') || null,
    propertyData: (() => {
      const raw = String(formData.get('propertyData') || '');
      try {
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })(),
    minPageViewsLast30d: formData.get('minPageViewsLast30d')
      ? Number(formData.get('minPageViewsLast30d'))
      : null,
    minProfileViewsLast30d: formData.get('minProfileViewsLast30d')
      ? Number(formData.get('minProfileViewsLast30d'))
      : null,
    allowedCities: String(formData.get('allowedCities') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    allowedAreas: String(formData.get('allowedAreas') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    allowedAgentSlugs: String(formData.get('allowedAgentSlugs') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    excludedCities: String(formData.get('excludedCities') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    excludedAreas: String(formData.get('excludedAreas') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    excludedAgentSlugs: String(formData.get('excludedAgentSlugs') || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  };

  const parsed = dealSchema.safeParse(payload);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('\n');
    return { error: msg };
  }

  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/deals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: h.get('cookie') ?? '' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { error: text || 'Failed to create deal' };
  }
  redirect('/admin/deals');
}

export default async function NewDealPage() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-zinc-950">Create Deal</h1>
      <NewDealWizard action={createDeal} />
    </div>
  );
}


