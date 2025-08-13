import Link from 'next/link';
import { headers } from 'next/headers';
import { requireAdmin } from '@/lib/admin';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

type PropertyItem = {
  id: string;
  title: string;
  slug: string | null;
  status: string;
  listingType: string;
  location: string;
  createdAt: string;
  agent: { slug: string };
};

async function fetchProperties(): Promise<{ items: PropertyItem[] }> {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/properties?page=1&pageSize=20`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load properties');
  return res.json();
}

export default async function AdminPropertiesPage() {
  await requireAdmin();
  const { items } = await fetchProperties();
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Properties</h1>
      <BulkPropertyActions />
      <div className="overflow-x-auto border border-zinc-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-3 py-2 text-left">Title</th>
              <th className="px-3 py-2 text-left">Agent</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Location</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">
                  {p.slug ? (
                    <Link href={`/${p.agent.slug}/properties/${p.slug}`} className="text-blue-600 hover:underline">{p.title}</Link>
                  ) : (
                    p.title
                  )}
                </td>
                <td className="px-3 py-2">
                  <Link href={`/${p.agent.slug}`} className="text-zinc-900 hover:underline">{p.agent.slug}</Link>
                </td>
                <td className="px-3 py-2">{p.status}</td>
                <td className="px-3 py-2">{p.listingType}</td>
                <td className="px-3 py-2">{p.location}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    <form action={updatePropertyStatus}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="status" value="Inactive" />
                      <Button type="submit" variant="destructive" disabled={p.status === 'Inactive'}>
                        Take down
                      </Button>
                    </form>
                    {p.status !== 'Available' && (
                      <form action={updatePropertyStatus}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="status" value="Available" />
                        <Button type="submit" variant="secondary">
                          Mark Available
                        </Button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function updatePropertyStatus(formData: FormData) {
  'use server';
  const admin = await requireAdmin();
  if (!admin) return;
  const id = String(formData.get('id'));
  const status = String(formData.get('status'));
  await prisma.property.update({ where: { id }, data: { status } });
  revalidatePath('/admin/properties');
}

async function BulkPropertyActions() {
  async function bulkPublish(formData: FormData) {
    'use server';
    const admin = await requireAdmin();
    if (!admin) return;
    const status = String(formData.get('status'));
    await prisma.property.updateMany({ data: { status } });
    revalidatePath('/admin/properties');
  }

  async function deleteAllDrafts() {
    'use server';
    const admin = await requireAdmin();
    if (!admin) return;
    await prisma.property.deleteMany({ where: { status: 'Draft' } });
    revalidatePath('/admin/properties');
  }

  return (
    <div className="mb-4 flex flex-wrap gap-3">
      <form action={bulkPublish} className="flex items-center gap-2">
        <input type="hidden" name="status" value="Available" />
        <Button type="submit" variant="secondary">Mark all as Available</Button>
      </form>
      <form action={bulkPublish} className="flex items-center gap-2">
        <input type="hidden" name="status" value="Sold" />
        <Button type="submit" variant="secondary">Mark all as Sold</Button>
      </form>
      <form action={deleteAllDrafts}>
        <Button type="submit" variant="destructive">Delete all Drafts</Button>
      </form>
    </div>
  );
}


