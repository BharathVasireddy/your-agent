import { headers } from 'next/headers';
import { requireAdmin } from '@/lib/admin';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  if (!admin) return null;

  const h = await headers();
  const host = h.get('host')!;
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const res = await fetch(`${protocol}://${host}/api/admin/kpis`, {
    headers: { cookie: h.get('cookie') ?? '' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load KPIs');
  const { usersCount, agentsCount, propertiesCount, paymentsLast30Days } = await res.json();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard label="Users" value={usersCount} />
      <KpiCard label="Agents" value={agentsCount} />
      <KpiCard label="Properties" value={propertiesCount} />
      <KpiCard label="Payments (30d)" value={paymentsLast30Days} />
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-zinc-200 rounded-lg p-4 bg-white">
      <div className="text-sm text-zinc-500">{label}</div>
      <div className="text-2xl font-semibold">{Intl.NumberFormat().format(value)}</div>
    </div>
  );
}


