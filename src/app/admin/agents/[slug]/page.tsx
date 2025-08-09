import Link from 'next/link';
import { headers } from 'next/headers';
import { requireAdmin } from '@/lib/admin';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

async function fetchAgent(slug: string) {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/agents/${slug}`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load agent');
  return res.json();
}

export default async function AdminAgentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const { agent } = await fetchAgent(slug);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">{agent.slug}</h1>
        <p className="text-sm text-zinc-600">{[agent.city, agent.area].filter(Boolean).join(' / ')}</p>
      </div>

      <AdminAgentActions slug={agent.slug} isSubscribed={agent.isSubscribed} />

      <section className="border border-zinc-200 rounded-lg p-4">
        <h2 className="font-medium mb-2">User</h2>
        <div className="text-sm text-zinc-700">{agent.user?.email ?? '—'}</div>
      </section>

      <section className="border border-zinc-200 rounded-lg p-4">
        <h2 className="font-medium mb-2">Recent Properties</h2>
        <ul className="text-sm text-zinc-700 list-disc pl-6">
          {agent.properties.map((p: { id: string; slug: string; title: string }) => (
            <li key={p.id}>
              <Link href={`/${agent.slug}/properties/${p.slug}`} className="text-blue-600 hover:underline">{p.title}</Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border border-zinc-200 rounded-lg p-4">
        <h2 className="font-medium mb-2">Recent Leads</h2>
        <div className="text-sm text-zinc-700">{agent.leads.length} lead(s)</div>
      </section>

      <section className="border border-zinc-200 rounded-lg p-4">
        <h2 className="font-medium mb-2">Recent Page Views</h2>
        <div className="text-sm text-zinc-700">{agent.pageViews.length} view(s)</div>
      </section>
    </div>
  );
}

async function AdminAgentActions({ slug, isSubscribed }: { slug: string; isSubscribed: boolean }) {
  async function toggleSubscription(formData: FormData) {
    'use server';
    const admin = await requireAdmin();
    if (!admin) return;
    const s = String(formData.get('slug'));
    const desired = String(formData.get('desired')) === 'true';
    await prisma.agent.update({ where: { slug: s }, data: { isSubscribed: desired } });
    revalidatePath(`/admin/agents/${s}`);
    revalidatePath('/admin/agents');
  }

  async function deleteAgent(formData: FormData) {
    'use server';
    const admin = await requireAdmin();
    if (!admin) return;
    const s = String(formData.get('slug'));
    await prisma.agent.delete({ where: { slug: s } });
    revalidatePath('/admin/agents');
  }

  return (
    <section className="border border-zinc-200 rounded-lg p-4 flex flex-col gap-3">
      <h2 className="font-medium">Admin Actions</h2>
      <div className="flex flex-wrap gap-3">
        <form action={toggleSubscription}>
          <input type="hidden" name="slug" value={slug} />
          <input type="hidden" name="desired" value={(!isSubscribed).toString()} />
          <Button type="submit" variant="secondary">
            {isSubscribed ? 'Disable Subscription' : 'Enable Subscription'}
          </Button>
        </form>

        <form action={deleteAgent}>
          <input type="hidden" name="slug" value={slug} />
          <Button type="submit" variant="destructive">
            Delete Agent
          </Button>
        </form>
      </div>
    </section>
  );
}


