import { redirect } from 'next/navigation';
import { getCachedSession, getAgentLeads } from '@/lib/dashboard-data';

function parseLeadMetadata(metadata: string | null) {
  try {
    return metadata ? JSON.parse(metadata) as Record<string, unknown> : {};
  } catch {
    return {} as Record<string, unknown>;
  }
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const session = await getCachedSession();
  if (!session?.user) {
    redirect('/api/auth/signin');
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  const params = await searchParams;
  const page = params.page ? Math.max(1, parseInt(params.page)) : 1;
  const q = params.q || undefined;
  const source = params.source || undefined;
  const startDate = params.startDate || undefined;
  const endDate = params.endDate || undefined;

  const { items, total, pages } = await getAgentLeads(userId, { page, take: 20, q, source, startDate, endDate });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-950">Leads</h1>
          <p className="text-zinc-600">Inbound inquiries from your website contact forms.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-5">
        <form className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search..."
            className="md:col-span-4 w-full border border-zinc-300 rounded-md px-3 py-2 text-sm"
          />
          <select name="source" defaultValue={source} className="md:col-span-3 w-full border border-zinc-300 rounded-md px-3 py-2 text-sm">
            <option value="">All sources</option>
            <option value="contact-form">Contact form</option>
            <option value="property">Property</option>
          </select>
          <input type="date" name="startDate" defaultValue={startDate} className="md:col-span-2 w-full border border-zinc-300 rounded-md px-3 py-2 text-sm" />
          <input type="date" name="endDate" defaultValue={endDate} className="md:col-span-2 w-full border border-zinc-300 rounded-md px-3 py-2 text-sm" />
          <div className="md:col-span-1 flex gap-2">
            <button className="flex-1 bg-zinc-900 text-white rounded-md px-3 py-2 text-sm" formAction="?" formMethod="get">Apply</button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-zinc-200 rounded-lg mt-4">
        {/* Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b border-zinc-200 text-sm font-semibold text-zinc-700">
          <div className="col-span-1">
            <input type="checkbox" aria-label="Select all" />
          </div>
          <div className="col-span-3">Name & Email</div>
          <div className="col-span-2">Phone</div>
          <div className="col-span-4">Subject</div>
          <div className="col-span-2">Received</div>
        </div>
        <div className="divide-y divide-zinc-200">
          {items.length === 0 && (
            <div className="p-8 text-center text-zinc-600">No leads yet. Share your website to start receiving inquiries.</div>
          )}
          {items.map((lead) => {
            const data = parseLeadMetadata(lead.metadata as unknown as string);
            const name = (data.name as string) || 'Unknown';
            const email = (data.email as string) || '';
            const phone = (data.phone as string) || '';
            const subject = (data.subject as string) || '';
            const message = (data.message as string) || '';
            const createdAt = new Date(lead.timestamp).toLocaleString();
            return (
              <div key={lead.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 px-4 py-4 items-center">
                <div className="md:col-span-1">
                  <input type="checkbox" aria-label={`Select ${name}`} />
                </div>
                <div className="md:col-span-3">
                  <div className="font-medium text-zinc-900">{name}</div>
                  {email && <div className="text-sm text-zinc-600">{email}</div>}
                </div>
                <div className="md:col-span-2 text-zinc-700">{phone || '-'}</div>
                <div className="md:col-span-4">
                  <div className="text-zinc-800 text-sm line-clamp-1" title={subject}>{subject || message}</div>
                </div>
                <div className="md:col-span-2 text-zinc-600 text-sm">{createdAt}</div>
                {/* Full message for mobile */}
                <div className="md:hidden col-span-12 text-zinc-700 text-sm">{message}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bulk actions (non-functional placeholders for now) */}
      <div className="flex items-center gap-2 text-sm text-zinc-700">
        <button className="px-3 py-2 rounded-md border border-zinc-300 hover:bg-zinc-50">Delete selected</button>
        <button className="px-3 py-2 rounded-md border border-zinc-300 hover:bg-zinc-50">Mark as contacted</button>
        <button className="px-3 py-2 rounded-md border border-zinc-300 hover:bg-zinc-50">Export CSV</button>
      </div>

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


