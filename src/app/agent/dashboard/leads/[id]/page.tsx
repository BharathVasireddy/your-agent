import { redirect } from 'next/navigation';
import { getCachedSession } from '@/lib/dashboard-data';
import prisma from '@/lib/prisma';
import ActivityTimeline from './ActivityTimeline';
import CopyButton from '../CopyButton';
import UpdateLeadInlineClient from './UpdateLeadInlineClient';
import LeadStageBadge from '../../leads/LeadStageBadge';
import type { Stage } from '../../leads/StageSelect';

function parseLeadMetadata(metadata: string | null) {
  try {
    return metadata ? JSON.parse(metadata) as Record<string, unknown> : {};
  } catch {
    return {} as Record<string, unknown>;
  }
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getCachedSession();
  if (!session?.user) redirect('/login');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session as any).user.id as string;

  const { id } = await params;
  // Accept either the `slug` or the `id` segment
  const lead = await prisma.lead.findFirst({
    where: {
      agent: { userId },
      deletedAt: null,
      OR: [ { id }, { slug: id } ],
    },
    include: { notes: { orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true, email: true } } } } }
  });
  if (!lead) redirect('/agent/dashboard/leads');

  // Fetch follow-up activities (source of truth)
  const followups = await prisma.leadActivity.findMany({
    where: { leadId: lead.id, type: 'followup-scheduled' },
    orderBy: { createdAt: 'desc' },
    select: { id: true, data: true, createdAt: true }
  });

  const data = parseLeadMetadata(lead.metadata as string | null);
  const name = (data.name as string) || 'Unknown';
  const email = (data.email as string) || '';
  const phone = (data.phone as string) || '';
  const _subject = (data.subject as string) || '';
  const _message = (data.message as string) || '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-950">Lead</h1>
        <p className="text-zinc-600">View and update this inquiry.</p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <div className="text-zinc-500">Name</div>
            <div className="text-zinc-900 font-medium text-base">{name}</div>
          </div>
          <div>
            <div className="text-zinc-500">Email</div>
            <div className="text-zinc-900 flex items-center gap-2">
              <span>{email || '-'}</span>
              {email && (<CopyButton value={email} />)}
            </div>
          </div>
          <div>
            <div className="text-zinc-500">Phone</div>
            <div className="text-zinc-900 flex items-center gap-2">
              <span>{phone || '-'}</span>
              {phone && (
                <>
                  <CopyButton value={phone} />
                  <a
                    href={`https://wa.me/${String(phone).replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-zinc-300 hover:bg-zinc-50"
                    aria-label="Open WhatsApp"
                    title="Open WhatsApp"
                  >
                    <svg viewBox="0 0 32 32" className="h-4 w-4 text-green-600" fill="currentColor" aria-hidden="true"><path d="M19.11 17.29a.9.9 0 0 0-.61-.43c-.16-.03-.31-.06-.45-.1-.41-.11-.83-.23-1.2-.43-.58-.32-1.01-.8-1.39-1.35-.15-.22-.29-.45-.4-.69-.1-.2-.18-.42-.25-.63-.06-.2-.11-.41-.14-.62a.9.9 0 0 0-.29-.55.86.86 0 0 0-.6-.22h-1.22c-.26 0-.5.1-.68.3-.2.2-.31.47-.3.75.02.57.14 1.12.35 1.64.39.96.97 1.83 1.73 2.55.8.77 1.76 1.35 2.82 1.7.54.18 1.1.3 1.67.34.28.02.55-.1.74-.29.2-.2.31-.46.31-.74v-1.15c0-.2-.07-.4-.21-.56ZM16 4C9.37 4 4 9.37 4 16c0 2.1.54 4.12 1.57 5.91L4 28l6.18-1.6A11.93 11.93 0 0 0 16 28c6.63 0 12-5.37 12-12S22.63 4 16 4Zm0 21.6c-1.83 0-3.6-.49-5.15-1.43l-.37-.22-3.66.94.98-3.57-.24-.37A9.96 9.96 0 0 1 6 16c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10Z"/></svg>
                  </a>
                </>
              )}
            </div>
          </div>
          <div>
            <div className="text-zinc-500">Lead Created On</div>
            <div className="text-zinc-900">{new Date(lead.timestamp).toLocaleString()}</div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div className="text-sm text-zinc-500">Current Stage</div>
          <LeadStageBadge stage={(lead.stage as Stage) ?? 'new'} />
          <UpdateLeadInlineClient leadId={lead.id} initialStage={(lead.stage as Stage) ?? 'new'} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-6">
          <h2 className="text-base font-semibold text-zinc-900 mb-3">Follow-ups</h2>
          <div className="space-y-2">
            {followups.length === 0 && (
              <div className="text-sm text-zinc-600">No follow-ups scheduled.</div>
            )}
            {followups.map((fu) => {
              const at = (fu.data as unknown as { at?: string })?.at;
              return (
                <div key={fu.id} className="flex items-center gap-2 text-sm text-zinc-800">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-orange-600" fill="currentColor" aria-hidden><path d="M12 8a1 1 0 0 1 1 1v3.06l2.47 1.42a1 1 0 1 1-1 1.73l-3-1.73A1 1 0 0 1 11 12V9a1 1 0 0 1 1-1Zm0-6a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"/></svg>
                  <span>{at ? new Date(String(at)).toLocaleString() : new Date(fu.createdAt).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-6">
          <h2 className="text-base font-semibold text-zinc-900 mb-3">Notes</h2>
          <div className="space-y-3">
            {lead.notes.length === 0 && <div className="text-sm text-zinc-600">No notes yet.</div>}
            {lead.notes.map(n => (
              <div key={n.id} className="text-sm">
                <div className="text-zinc-900">{n.text}</div>
                <div className="text-zinc-500">{new Date(n.createdAt).toLocaleString()} · {(n.user?.name || n.user?.email || 'You')}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-lg p-4 md:p-6">
          <h2 className="text-base font-semibold text-zinc-900 mb-3">Activity</h2>
          <ActivityTimeline leadId={lead.id} />
        </div>
      </div>
    </div>
  );
}


