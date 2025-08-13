"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import UpdateLeadDialog from "./UpdateLeadDialog";

type Stage = 'new'|'contacted'|'qualified'|'won'|'lost';

type LeadItem = {
  id: string;
  type: string;
  source: string | null;
  timestamp: string | Date;
  updatedAt: string | Date;
  propertyId: string | null;
  metadata: unknown;
  agentId: string;
  stage?: Stage;
  slug?: string | null;
};

function parseLeadMetadata(metadata: unknown): Record<string, unknown> {
  try {
    if (typeof metadata === 'string') return JSON.parse(metadata) as Record<string, unknown>;
    return (metadata ?? {}) as Record<string, unknown>;
  } catch {
    return {} as Record<string, unknown>;
  }
}

export default function LeadsListClient({ items }: { items: LeadItem[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const allIds = useMemo(() => items.map(i => i.id), [items]);
  const allSelected = selected.size > 0 && selected.size === items.length;
  const toggle = (id: string) => setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const toggleAll = () => setSelected(prev => (prev.size ? new Set() : new Set(allIds)));
  // const router = useRouter();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b border-zinc-200 text-xs font-medium text-zinc-600 sticky top-0 bg-white rounded-t-lg">
        <div className="col-span-1">
          <input type="checkbox" aria-label="Select all" checked={allSelected} onChange={toggleAll} />
        </div>
        <div className="col-span-3">Lead Name</div>
        <div className="col-span-2">Phone</div>
        <div className="col-span-2">Source</div>
        <div className="col-span-2">Lead Stage</div>
        <div className="col-span-2 text-right">Actions</div>
      </div>
      <div className="divide-y divide-zinc-200">
        {items.map((lead) => {
          const data = parseLeadMetadata(lead.metadata);
          const name = (data.name as string) || 'Unknown';
          const phone = (data.phone as string) || '';
          const href = `/agent/dashboard/leads/${encodeURIComponent(lead.slug || name.toString().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'') || lead.id)}`;
          return (
            <div key={lead.id} className="px-4">
              <div className="grid grid-cols-12 gap-4 py-3 items-center">
                <div className="col-span-1">
                  <input type="checkbox" aria-label={`Select ${name}`} checked={selected.has(lead.id)} onChange={()=>toggle(lead.id)} />
                </div>
                <div className="col-span-3">
                  <a href={href} className="font-medium text-zinc-900 hover:underline">{name}</a>
                </div>
                <div className="col-span-2 text-zinc-700">{phone || '-'}</div>
                <div className="col-span-2 text-zinc-700">{lead.source || '-'}</div>
                <div className="col-span-2 text-zinc-700 capitalize">{(lead.stage as Stage) || 'new'}</div>
                <div className="col-span-2 flex justify-end gap-2">
                  <a href={href} className="h-8 px-3 rounded-md border border-zinc-300 hover:bg-zinc-50 text-sm">View</a>
                  <button onClick={()=>setOpenId(lead.id)} className="h-8 px-3 rounded-md border border-zinc-300 hover:bg-zinc-50 text-sm">Update</button>
                </div>
              </div>
              <UpdateLeadDialog open={openId === lead.id} onClose={()=>setOpenId(null)} leadId={lead.id} initialStage={(lead.stage as Stage) ?? 'new'} />
            </div>
          );
        })}
      </div>
    </div>
  );
}


