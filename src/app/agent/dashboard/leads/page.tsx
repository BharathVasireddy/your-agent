import { redirect } from 'next/navigation';
import { getCachedSession, getAgentLeads, getCachedAgent } from '@/lib/dashboard-data';
import LeadsDataTable from './LeadsDataTable';
import TopFiltersClient from './TopFiltersClient';

// removed unused helper

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const session = await getCachedSession();
  if (!session?.user) {
    redirect('/login');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  const params = await searchParams;
  const page = params.page ? Math.max(1, parseInt(params.page)) : 1;
  const q = params.q || '';
  const stage = params.stage || '';
  const source = params.source || '';

  const { items, total, pages } = await getAgentLeads(userId, { page, take: 20, q: q || undefined, stage: stage || undefined, source: source || undefined });
  const agent = await getCachedAgent(userId);
  const slug = agent?.slug as string | undefined;
  const search = new URLSearchParams();
  if (q) search.set('q', q);
  if (stage) search.set('stage', stage);
  if (source) search.set('source', source);
  const baseExportUrl = slug ? `/api/agents/${slug}/leads/export` : '#';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">Leads</h1>
          <p className="text-zinc-600">Inbound inquiries from your website contact forms.</p>
        </div>
      </div>

      {/* Top bar: search + export with auto-submit on filter change */}
      <TopFiltersClient initial={{ q, stage, source }} exportUrl={baseExportUrl} />

      {/* Table - shadcn data table style */}
      <div className="bg-white border border-zinc-200 rounded-lg mt-0">
        {items.length === 0 ? (
          <div className="p-8 text-center text-zinc-600">No leads yet. Share your website to start receiving inquiries.</div>
        ) : (
          <LeadsDataTable rows={(items as Array<{ id: string; source: string | null; metadata: unknown; stage?: 'new'|'contacted'|'qualified'|'won'|'lost'; slug?: string | null; timestamp: string | Date; }>).map(l => {
            let data: { name?: string; phone?: string } = {};
            try { data = typeof l.metadata === 'string' ? JSON.parse(l.metadata as string) : (l.metadata as Record<string, unknown>) || {}; } catch { data = {}; }
            return {
              id: l.id,
              name: (data.name as string) || 'Unknown',
              phone: (data.phone as string) || '',
              source: l.source || null,
              stage: (l.stage || 'new') as 'new'|'contacted'|'qualified'|'won'|'lost',
              slug: l.slug || null,
              timestamp: (typeof l.timestamp === 'string' ? l.timestamp : l.timestamp.toISOString()),
            };
          })} />
        )}
      </div>

      {/* Removed sidebar and extra controls per minimal spec */}

      {/* Simple pagination summary */}
      {pages > 1 && (
        <div className="flex items-center justify-between text-sm text-zinc-600">
          <div>
            Showing {(page - 1) * 20 + 1}-{Math.min(page * 20, total)} of {total}
          </div>
        </div>
      )}
    </div>
  );
}


