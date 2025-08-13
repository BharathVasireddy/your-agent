import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

function toCsvRow(values: string[]): string {
  return values.map((v)=>`"${(v ?? '').replace(/"/g,'""')}"`).join(',');
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = new URL(request.url);
  const q = url.searchParams.get('q') ?? undefined;
  const source = url.searchParams.get('source') ?? undefined;
  const stage = url.searchParams.get('stage') as 'new'|'contacted'|'qualified'|'won'|'lost' | null;
  const startDate = url.searchParams.get('startDate') ?? undefined;
  const endDate = url.searchParams.get('endDate') ?? undefined;

  const agent = await prisma.agent.findUnique({ where: { slug }, select: { id: true } });
  if (!agent) return new Response('Agent not found', { status: 404 });

  let dateFilter: { gte?: Date; lte?: Date } | undefined;
  if (startDate || endDate) {
    dateFilter = {};
    if (startDate) dateFilter.gte = new Date(startDate + 'T00:00:00.000Z');
    if (endDate) dateFilter.lte = new Date(endDate + 'T23:59:59.999Z');
  }

  const where = {
    agentId: agent.id,
    deletedAt: null as unknown as undefined,
    ...(source ? { source: { equals: source, mode: 'insensitive' as const } } : {}),
    ...(stage ? { stage } : {}),
    ...(dateFilter ? { timestamp: dateFilter } : {}),
    ...(q ? { OR: [ { metadata: { contains: q, mode: 'insensitive' as const } }, { source: { contains: q, mode: 'insensitive' as const } }, ] } : {}),
  } as const;

  const leads = await prisma.lead.findMany({ where, orderBy: { timestamp: 'desc' }, select: { id: true, timestamp: true, source: true, stage: true, metadata: true } });

  const header = toCsvRow(['id','timestamp','source','stage','name','email','phone','subject','message']);
  const rows: string[] = [header];
  for (const l of leads) {
    let data: Record<string, unknown> = {};
    try { data = l.metadata ? JSON.parse(l.metadata as unknown as string) : {}; } catch { data = {}; }
    rows.push(toCsvRow([
      l.id,
      new Date(l.timestamp as unknown as string).toISOString(),
      l.source || '',
      l.stage || '',
      (data.name as string) || '',
      (data.email as string) || '',
      (data.phone as string) || '',
      (data.subject as string) || '',
      (data.message as string) || '',
    ]));
  }

  const csv = rows.join('\n');
  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="leads.csv"',
      'Cache-Control': 'no-store'
    }
  });
}


