"use client";

import { useMemo, useState, useTransition } from "react";
import { bulkSoftDeleteLeads, bulkUpdateLeadStage } from "@/app/actions";

type Stage = 'new'|'contacted'|'qualified'|'won'|'lost';

export default function LeadsTableClient({ items }: { items: Array<{ id: string; metadata: unknown; timestamp: string; }>; }) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [isPending, startTransition] = useTransition();

  const ids = useMemo(() => Array.from(selected), [selected]);
  const toggle = (id: string) => setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  const toggleAll = () => setSelected(prev => prev.size ? new Set() : new Set(items.map(i => i.id)));

  const onBulkStage = (stage: Stage) => {
    if (!ids.length) return;
    startTransition(async () => { try { await bulkUpdateLeadStage(ids, stage); setSelected(new Set()); } catch {} });
  };
  const onBulkDelete = () => {
    if (!ids.length) return;
    startTransition(async () => { try { await bulkSoftDeleteLeads(ids); setSelected(new Set()); } catch {} });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-zinc-700">
        <button onClick={onBulkDelete} className="px-3 py-2 rounded-md border border-zinc-300 hover:bg-zinc-50 disabled:opacity-50" disabled={isPending || ids.length === 0}>Delete selected</button>
        <div className="flex items-center gap-2">
          <span className="text-zinc-600">Mark as</span>
          <select onChange={(e)=>{ const v = e.target.value as Stage; if (v) { onBulkStage(v); } e.currentTarget.selectedIndex = 0; return undefined; }} className="border border-zinc-300 rounded px-2 py-1">
            <option value="">Select stage…</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>
        {ids.length > 0 && <span className="text-zinc-500">{ids.length} selected</span>}
        {isPending && <span className="text-zinc-500">Saving…</span>}
      </div>
      <div className="divide-y divide-zinc-200">
        {items.map((it) => (
          <div key={it.id} className="grid grid-cols-12 gap-4 px-4 py-4 items-center">
            <div className="col-span-1">
              <input type="checkbox" aria-label="Select" checked={selected.has(it.id)} onChange={()=>toggle(it.id)} />
            </div>
            <div className="col-span-11" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-xs text-zinc-500">
        <button onClick={toggleAll} className="underline">{selected.size ? 'Clear selection' : 'Select all'}</button>
      </div>
    </div>
  );
}


