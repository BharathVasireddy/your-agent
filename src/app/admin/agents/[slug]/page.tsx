import Link from 'next/link';
import { headers } from 'next/headers';
import { requireAdmin } from '@/lib/admin';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Button } from '@/components/ui/button';
import { type Plan, type Interval } from '@/lib/subscriptions';

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

      <AdminSubscriptionForm 
        agentSlug={agent.slug} 
        userId={agent.user?.id}
        currentPlan={agent.subscriptionPlan}
        currentInterval={agent.subscriptionInterval}
      />

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

async function AdminSubscriptionForm({ agentSlug, userId, currentPlan, currentInterval }: { agentSlug: string; userId?: string; currentPlan?: string | null; currentInterval?: string | null }) {
  async function setSubscription(formData: FormData) {
    'use server';
    const admin = await requireAdmin();
    if (!admin) return;
    const slug = String(formData.get('agentSlug'));
    const plan = String(formData.get('plan')) as Plan;
    const interval = String(formData.get('interval')) as Interval;
    const amountPaise = parseInt(String(formData.get('amountPaise')) || '0', 10) || null;
    const method = String(formData.get('collectionMethod') || 'manual');
    const referenceId = String(formData.get('referenceId') || '');
    const notes = String(formData.get('notes') || '');

    const now = new Date();
    const months = interval === 'monthly' ? 1 : interval === 'quarterly' ? 3 : 12;
    const periodEndsAt = new Date(now);
    periodEndsAt.setMonth(periodEndsAt.getMonth() + months);

    await prisma.agent.update({
      where: { slug },
      data: {
        isSubscribed: true,
        subscriptionPlan: plan,
        subscriptionInterval: interval,
        subscriptionEndsAt: periodEndsAt,
      },
    });

    // Note: Skipping creation of Payment record here since "razorpayOrderId" and "razorpayPaymentId" are required.
    // For manual/admin grants, we only update the agent's subscription fields.

    revalidatePath(`/admin/agents/${slug}`);
    revalidatePath('/admin/agents');
  }

  async function clearSubscription(formData: FormData) {
    'use server';
    const admin = await requireAdmin();
    if (!admin) return;
    const slug = String(formData.get('agentSlug'));
    await prisma.agent.update({
      where: { slug },
      data: { isSubscribed: false, subscriptionPlan: null, subscriptionInterval: null, subscriptionEndsAt: null },
    });
    revalidatePath(`/admin/agents/${slug}`);
    revalidatePath('/admin/agents');
  }

  const plans: Plan[] = ['starter','growth','pro'];
  const intervals: Interval[] = ['monthly','quarterly','yearly'];

  return (
    <section className="border border-zinc-200 rounded-lg p-4">
      <h2 className="font-medium mb-3">Subscription</h2>
      <form action={setSubscription} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="hidden" name="agentSlug" value={agentSlug} />
        <div>
          <label className="block text-xs text-zinc-600 mb-1">Plan</label>
          <select name="plan" defaultValue={(currentPlan as Plan) ?? 'starter'} className="w-full border border-zinc-300 rounded-md px-2 py-2 text-sm bg-white">
            {plans.map(p => (<option key={p} value={p}>{p}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-zinc-600 mb-1">Interval</label>
          <select name="interval" defaultValue={(currentInterval as Interval) ?? 'monthly'} className="w-full border border-zinc-300 rounded-md px-2 py-2 text-sm bg-white">
            {intervals.map(i => (<option key={i} value={i}>{i}</option>))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-zinc-600 mb-1">Amount (paise)</label>
          <input name="amountPaise" type="number" min="0" placeholder="e.g. 29900" className="w-full border border-zinc-300 rounded-md px-2 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-zinc-600 mb-1">Collection Method</label>
          <select name="collectionMethod" defaultValue="manual" className="w-full border border-zinc-300 rounded-md px-2 py-2 text-sm bg-white">
            <option value="manual">Manual</option>
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
            <option value="bank-transfer">Bank Transfer</option>
            <option value="razorpay">Razorpay</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-zinc-600 mb-1">Reference ID</label>
          <input name="referenceId" type="text" placeholder="Txn ID, UTR, receipt no..." className="w-full border border-zinc-300 rounded-md px-2 py-2 text-sm" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-zinc-600 mb-1">Notes</label>
          <textarea name="notes" rows={3} className="w-full border border-zinc-300 rounded-md px-2 py-2 text-sm" placeholder="Any remarks about this collection" />
        </div>
        <div className="md:col-span-2 flex gap-2">
          <Button type="submit">Save Subscription</Button>
          <form action={clearSubscription}>
            <input type="hidden" name="agentSlug" value={agentSlug} />
            <Button type="submit" variant="outline">Clear</Button>
          </form>
        </div>
      </form>
    </section>
  );
}


