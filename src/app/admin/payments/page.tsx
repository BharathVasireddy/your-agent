import Link from 'next/link';
import { headers } from 'next/headers';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

type PaymentItem = {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
  status: string;
  type: string;
  createdAt: string;
  user: { email: string | null };
  agent: { slug: string } | null;
};

async function fetchPayments(): Promise<{ items: PaymentItem[] }> {
  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/payments?page=1&pageSize=20`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load payments');
  return res.json();
}

export default async function AdminPaymentsPage() {
  await requireAdmin();
  const { items } = await fetchPayments();
  const formatAmount = (amt: number, cur: string) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: cur }).format(amt / 100);
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Payments</h1>
      <div className="overflow-x-auto border border-zinc-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-3 py-2 text-left">Payment ID</th>
              <th className="px-3 py-2 text-left">User</th>
              <th className="px-3 py-2 text-left">Agent</th>
              <th className="px-3 py-2 text-left">Amount</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Type</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">{p.razorpayPaymentId}</td>
                <td className="px-3 py-2">{p.user.email ?? '—'}</td>
                <td className="px-3 py-2">{p.agent ? <Link className="text-zinc-900 hover:underline" href={`/${p.agent.slug}`}>{p.agent.slug}</Link> : '—'}</td>
                <td className="px-3 py-2">{formatAmount(p.amount, p.currency)}</td>
                <td className="px-3 py-2">{p.status}</td>
                <td className="px-3 py-2">{p.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


