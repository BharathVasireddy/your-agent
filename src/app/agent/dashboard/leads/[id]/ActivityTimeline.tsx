import prisma from '@/lib/prisma';
import { Timeline, TimelineContent, TimelineDot, TimelineHeading, TimelineItem, TimelineLine } from '@/components/ui/timeline';
import { Check, FileText, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function ActivityTimeline({ leadId }: { leadId: string }) {
  const items = await prisma.leadActivity.findMany({
    where: { leadId },
    orderBy: { createdAt: 'desc' },
    select: { id: true, type: true, data: true, createdAt: true }
  });

  if (items.length === 0) return null;

  // Map lead stages to heading/dot colors (aligned with stage pill colors)
  const STAGE_COLOR: Record<string, string> = {
    'new': 'text-zinc-700',
    'contacted': 'text-blue-700',
    'interested': 'text-sky-700',
    'appointment': 'text-violet-700',
    'negotiation': 'text-amber-800',
    'offer-made': 'text-cyan-700',
    'under-consideration': 'text-indigo-700',
    'won': 'text-green-700',
    'lost': 'text-red-700',
    'follow-up': 'text-orange-700',
  };

  const renderItem = (t: string, data: unknown) => {
    try {
      const d = data as Record<string, unknown>;
      switch (t) {
        case 'lead-created':
          return 'Lead created';
        case 'stage-changed':
          return `Stage changed to ${(d?.to as string) || ''}`;
        case 'note-added':
          return 'Note added';
        case 'followup-scheduled':
          return `Follow-up scheduled at ${(d?.at as string) || ''}`;
        default:
          return t;
      }
    } catch {
      return t;
    }
  };

  return (
    <Timeline className="[&>li]:py-1.5">
      {items.map((it, idx) => {
        const d = it.data as Record<string, unknown> | null;
        const stage = (it.type === 'stage-changed' ? (d?.to as string) : it.type === 'followup-scheduled' ? 'follow-up' : undefined) || '';
        const colorClass = stage ? (STAGE_COLOR[stage] || 'text-zinc-800') : 'text-zinc-800';
        const customIcon = it.type === 'stage-changed'
          ? <Check className="size-3" />
          : it.type === 'followup-scheduled'
            ? <Clock className="size-3" />
            : it.type === 'note-added'
              ? <FileText className="size-3" />
              : undefined;
        return (
          <TimelineItem key={it.id} status="default">
            <TimelineHeading side="right" className={cn('text-sm font-medium', colorClass)}>
              {renderItem(it.type, it.data)}
            </TimelineHeading>
            <TimelineDot status={customIcon ? 'custom' : 'default'} customIcon={customIcon} className={colorClass} />
            <TimelineLine className="bg-zinc-200" done={idx < items.length - 1} />
            <TimelineContent className="text-xs text-zinc-500">
              {it.type === 'followup-scheduled' && (d?.at ? new Date(String(d.at)).toLocaleString() + ' · ' : '')}
              {new Date(it.createdAt).toLocaleString()}
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}


