"use client";

import { useState, useTransition } from "react";
import { addLeadNote, assignLead, updateLeadStage } from "@/app/actions";

type Stage = 'new'|'contacted'|'qualified'|'won'|'lost';

export default function LeadRowClient({ leadId, initialStage, initialAssignee, message }: { leadId: string; initialStage: Stage; initialAssignee?: string | null; message?: string }) {
  const [stage, setStage] = useState<Stage>(initialStage);
  const [note, setNote] = useState("");
  const [assignee, setAssignee] = useState<string | "">(initialAssignee || "");
  const [isPending, startTransition] = useTransition();

  const saveStage = (next: Stage) => {
    setStage(next);
    startTransition(async () => {
      try { await updateLeadStage(leadId, next); } catch {}
    });
  };

  const saveAssignee = (next: string) => {
    setAssignee(next);
    startTransition(async () => {
      try { await assignLead(leadId, next || null); } catch {}
    });
  };

  const saveNote = () => {
    const text = note.trim();
    if (!text) return;
    startTransition(async () => {
      try { await addLeadNote(leadId, text); setNote(""); } catch {}
    });
  };

  return (
    <div className="flex flex-col gap-2 md:gap-1">
      <div className="flex items-center gap-2 text-xs">
        <select value={stage} onChange={(e)=>saveStage(e.target.value as Stage)} className="border border-zinc-300 rounded px-2 py-1">
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
        <input placeholder="Assign user ID" value={assignee} onChange={(e)=>saveAssignee(e.target.value)} className="border border-zinc-300 rounded px-2 py-1 w-40" />
        {isPending && <span className="text-zinc-500">Saving…</span>}
      </div>
      <div className="flex items-center gap-2">
        <input placeholder="Add note" value={note} onChange={(e)=>setNote(e.target.value)} className="flex-1 border border-zinc-300 rounded px-2 py-1 text-sm" />
        <button onClick={saveNote} className="px-3 py-1 bg-zinc-900 text-white rounded text-sm" disabled={isPending || !note.trim()}>Add</button>
      </div>
      {message && <div className="text-xs text-zinc-500 line-clamp-2" title={message}>{message}</div>}
    </div>
  );
}


